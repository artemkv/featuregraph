import React, { useEffect, useState } from 'react';
import MarkdownView from 'react-showdown';
import { useParams } from 'react-router-dom';
import M from 'materialize-css/dist/js/materialize.min.js';

import DocumentationToc from './DocumentationToc';

import index from '../doc/index.md';

export default function App() {
    const { page } = useParams();

    const [markdown, setMarkdown] = useState(index);

    useEffect(() => {
        const sideNav = document.querySelector('#slide-out');
        M.Sidenav.init(sideNav, {});
        const instance = M.Sidenav.getInstance(sideNav);
        return () => {
            instance.destroy();
        };
    }, []);

    useEffect(() => {
        switch (page) {
            default:
                setMarkdown(index);
        }
    }, [page]);

    return (
        <div>
            <div className="desktop">
                <div className="row">
                    <div className="col s3">
                        <DocumentationToc />
                    </div>
                    <div className="col s9">
                        <MarkdownView className='doc-page'
                            markdown={markdown}
                            options={{ tables: true, emoji: true }}
                        />
                    </div>
                </div>
            </div>
            <div className="mobile">
                <nav className="nav teal">
                    <a href="#" data-target="slide-out" className="sidenav-trigger">
                        <i className="material-icons">menu</i>
                    </a>
                    <ul>Documentation</ul>
                </nav>
                <ul id="slide-out" className="sidenav">
                    <div className="row sidenav-close">
                        <div className="col s12">
                            <DocumentationToc />
                        </div>
                    </div>
                </ul>
                <div className="row">
                    <div className="col s12">
                        <MarkdownView className='doc-page flow-text'
                            markdown={markdown}
                            options={{ tables: true, emoji: true }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
