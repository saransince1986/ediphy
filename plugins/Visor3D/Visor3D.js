import React from 'react';
import i18n from 'i18next';
import Visor3DPluginEditor from './components/Visor3DPluginEditor.js';

/* eslint-disable react/prop-types */
export function Visor3D(base) {
    return {
        getConfig: function() {
            return {
                name: 'Visor3D',
                displayName: i18n.t('Visor3D.PluginName'),
                category: "objects",
                flavor: "react",
                needsConfigModal: false,
                needsTextEdition: false,

                initialWidth: 'auto',
                initialHeight: "auto",
                initialWidthSlide: '30%',
                initialHeightSlide: '30%',
                // initialWidth: '480px',
                // initialHeight: "270px",
                icon: '3d_rotation',

            };
        },
        getToolbar: function(state) {
            return {
                main: {
                    __name: "Main",
                    accordions: {
                        basic: {
                            __name: i18n.t('Visor3D.source'),
                            icon: 'link',
                            buttons: {
                                url: {
                                    __name: i18n.t('Visor3D.URL'),
                                    type: 'external_provider',
                                    value: state.url,
                                    autoManaged: false,
                                },
                                color: {
                                    __name: Ediphy.i18n.t('BasicAudio.color'),
                                    type: 'color',
                                    value: state.color,
                                },
                            },
                        },
                    },
                },
            };
        },
        getInitialState: function() {
            return {
                url: "http://localhost:8080/stl/eyeball.stl",
                color: "#D358F7",
            };
        },
        getRenderTemplate: function(state, props) {
            console.log(state.color);
            return (
                <div className="3DViewerPlugin" style={{ height: "100%", width: "100%" }}>
                    <Visor3DPluginEditor style={{ width: "100%", height: "100%" }} state={state}/>
                </div>);
        },

    };
}
/* eslint-enable react/prop-types */
