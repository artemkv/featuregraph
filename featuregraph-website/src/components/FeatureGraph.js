import React, { useEffect, useRef } from 'react';
import cytoscape from 'cytoscape';
import { from } from 'datashaper-js';

// https://louisem.com/421408/gray-hex-codes
// https://htmlcolorcodes.com/colors/shades-of-gray/

export default (props) => {
    const graphData = props.graphData;

    const nodes = from(graphData.nodes ?? [])
        .map(x => ({
            data: {
                id: x.feature,
                cnt: x.count
            }
        }))
        .return();

    const total = from(graphData.edges ?? [])
        .map(x => (x.count))
        .return().reduce((acc, a) => acc + a, 0);

    const edges = from(graphData.edges ?? [])
        .map(x => ({
            data: {
                id: `${x.from}->${x.to}`,
                source: x.from,
                target: x.to,
                w: x.count / total * 20
            }
        }))
        .return();

    const graphRef = useRef(null)
    const drawGraph = () => {
        const cy = cytoscape({
            container: graphRef.current,
            elements: [
                // nodes
                ...nodes,
                // edges
                ...edges
            ],
            style: [
                {
                    selector: 'node',
                    style: {
                        'background-color': '#C0C0C0',
                        'label': function (ele) { return `${ele.data('id')} (${ele.data('cnt')})`; },
                        'color': '#363636'
                    }
                },
                {
                    selector: 'edge',
                    style: {
                        'width': 'data(w)',
                        'line-color': '#C0C0C0',
                        'target-arrow-color': '#C0C0C0',
                        'target-arrow-shape': 'triangle',
                        'curve-style': 'bezier'
                    }
                },
                {
                    selector: 'edge.incoming',
                    style: {
                        'line-color': '#2d89ef',
                        'target-arrow-color': '#2d89ef',
                    }
                },
                {
                    selector: 'edge.outgoing',
                    style: {
                        'line-color': '#ec407a',
                        'target-arrow-color': '#ec407a',
                    }
                },
                {
                    selector: 'edge.irrelevant',
                    style: {
                        'opacity': 0,
                    }
                }],

            layout: {
                name: 'circle'
            }
        });

        cy.on('click', function (e) {
            cy.edges().removeClass('incoming');
            cy.edges().removeClass('outgoing');
            cy.edges().removeClass('irrelevant');

            if (e.target === cy) {
            } else {
                cy.edges().addClass('irrelevant');
                cy.edges("[target='" + e.target.id() + "']").removeClass('irrelevant');
                cy.edges("[target='" + e.target.id() + "']").addClass('incoming');
                cy.edges("[source='" + e.target.id() + "']").removeClass('irrelevant');
                cy.edges("[source='" + e.target.id() + "']").addClass('outgoing');
            }
        });
    }

    useEffect(() => {
        drawGraph();
    }, [])

    return (<div ref={graphRef} id="feature_graph"></div>);
}