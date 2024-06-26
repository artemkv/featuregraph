import React, { useEffect, useState } from 'react';

import { Link } from 'react-router-dom';
import M from 'materialize-css/dist/js/materialize.min.js';
import { appsPath } from '../routing';

export default (props) => {
    const app = props.app;

    const validateName = (name) => {
        if (!name) {
            return 'Name is required';
        }
        if (name.length > 100) {
            return 'Name cannot be longer than 100 characters';
        }
        return '';
    };

    // TODO: does not really belong here, in a UI component
    const validateConfig = (config) => {
        if (!config) {
            return 'Config is required';
        }
        if (config.length > 10240) {
            return 'Config cannot be longer than 10240 characters';
        }
        try {
            JSON.parse(config);
        }
        catch
        {
            return 'Config is not a valid JSON';
        }

        return '';
    };

    const [name, setName] = useState(app.name);
    const [nameValidationResult, setNameValidationResult] = useState('');

    const [config, setConfig] = useState(app.config);
    const [configValidationResult, setConfigValidationResult] = useState('');

    // TODO: combined validation result
    const [isValid, setIsValid] = useState(!validateName(app.name) && !validateConfig(app.config));

    useEffect(() => {
        M.updateTextFields();
    }, []);

    const onNameChange = (event) => {
        const newName = event.target.value;
        setName(newName);
        setNameValidationResult(validateName(newName));
        setIsValid(!validateName(newName) && !validateConfig(config));
    };

    const onConfigChange = (event) => {
        const newConfig = event.target.value;
        setConfig(newConfig);
        setConfigValidationResult(validateConfig(newConfig));
        setIsValid(!validateName(name) && !validateConfig(newConfig));
    };

    const submit = () => {
        props.onSubmit({
            aid: app.aid,
            name,
            config
        });
    };

    return <div>
        <div className="row">
            <div className="container">

                <div className="row">
                    <Link to={appsPath}>
                        &lt; Back
                    </Link>
                </div>
                <div className="row">
                    <h4 className="header">{app.aid}</h4>
                </div>
                <div className="row">
                    <div className="input-field">
                        <input
                            value={name}
                            id="app_editor_app_name"
                            type="text"
                            className={nameValidationResult ? 'invalid' : 'valid'}
                            onChange={onNameChange} />
                        <label htmlFor="app_editor_app_name">Name</label>
                        <span className="helper-text" data-error={nameValidationResult} />
                    </div>
                </div>
                <div className="row">
                    <div className="input-field">
                        <textarea
                            value={config}
                            id="app_editor_app_config"
                            className={'materialize-textarea ' + (configValidationResult ? 'invalid' : 'valid')}
                            onChange={onConfigChange} />
                        <label htmlFor="app_editor_app_config">Config</label>
                        <span className="helper-text" data-error={configValidationResult} />
                    </div>
                </div>
                <div className="row">
                    <div className="right-align">
                        <div>
                            <button
                                className={'btn waves-effect waves-light' + (isValid ? '' : ' disabled')}
                                onClick={submit}>
                                Save
                                <i className="material-icons right">check_circle</i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>;
};
