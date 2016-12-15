import React, {Component} from 'react';
import {Tooltip, FormControl, OverlayTrigger, FormGroup, Radio, ControlLabel, Checkbox,  Button, ButtonGroup, PanelGroup, Accordion, Panel, Tabs, Tab} from 'react-bootstrap';
import ReactDOM from 'react-dom';
import GridConfigurator from '../grid_configurator/GridConfigurator.jsx';
import RadioButtonFormGroup from '../radio_button_form_group/RadioButtonFormGroup.jsx';
import Select from 'react-select';
import VishProvider from './../../vish_provider/vish_provider/VishProvider';
import MarksList from './../../rich_plugins/marks_list/MarksList.jsx';
import ContentList from './../../rich_plugins/content_list/ContentList.jsx';
import Dali from './../../../core/main';
import {UPDATE_TOOLBAR, UPDATE_BOX} from '../../../actions';
import {isSortableContainer} from '../../../utils';
import i18n from 'i18next';

require('./_pluginToolbar.scss');

export default class PluginToolbar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false
        };
    }

    render() {
        if (this.props.boxSelected === -1) {
            return (
                /* jshint ignore:start */
                <div id="wrap"
                     className="wrapper hiddenWrapper"
                     style={{
                        top: this.props.top
                     }}>
                    <div id="tools" className="toolbox">
                    </div>
                </div>
                /* jshint ignore:end */
            );
        }

        let toolbar = this.props.toolbars[this.props.box.id];

        // We define the extra buttons we need depending on plugin's configuration
        let textButton;
        if (toolbar.config.needsTextEdition) {
            textButton = (
                /* jshint ignore:start */
                <Button key={'text'}
                        className={toolbar.showTextEditor ? 'toolbarButton textediting' : 'toolbarButton'}
                        onClick={() => {
                            this.props.onTextEditorToggled(toolbar.id, !toolbar.showTextEditor);
                        }}>
                    Edit text
                </Button>
                /* jshint ignore:end */
            );
        }
        let xmlButton;
        if (toolbar.config.needsXMLEdition) {
            xmlButton = (
                /* jshint ignore:start */
                <Button key={'xml'}
                        className={toolbar.showXMLEditor ? 'toolbarButton textediting' : 'toolbarButton'}
                        onClick={() => {
                            this.props.onXMLEditorToggled();
                        }}>
                    Edit XML
                </Button>
                /* jshint ignore:end */
            );
        }
        let configButton;
        if (toolbar.config && toolbar.config.needsConfigModal) {
            configButton = (
                /* jshint ignore:start */
                <Button key={'config'}
                        className='toolbarButton'
                        onClick={() => {
                            Dali.Plugins.get(toolbar.config.name).openConfigModal(UPDATE_BOX, toolbar.state, toolbar.id);
                        }}>
                    Open config
                </Button>
                /* jshint ignore:end */
            );
        }

        let duplicateButton;
        if (this.props.box.id[1] !== 's') {
            duplicateButton = (
                /* jshint ignore:start */
                <Button key={'duplicate'}
                        className="pluginToolbarMainButton"
                        onClick={e => {
                            this.props.onBoxDuplicated(this.props.box.id, this.props.box.parent, this.props.box.container);
                            e.stopPropagation();
                        }}>
                    <i className="material-icons">content_copy</i>
                </Button>
                /* jshint ignore:end */
            );
        }

        return (
            /* jshint ignore:start */
            <div id="wrap"
                 className="wrapper"
                 style={{
                        right: '0px',
                        top: this.props.top
                     }}>
                <div className="pestana"
                     onClick={() => {
                        this.setState({open: !this.state.open});
                     }}>
                </div>
                <div id="tools"
                     style={{
                        width: this.state.open ? '250px' : '40px'
                     }}
                     className="toolbox">
                    <OverlayTrigger placement="left"
                                    overlay={
                                        <Tooltip className={this.state.open ? 'hidden':''}
                                                 id="tooltip_props">
                                            {i18n.t('Properties')}
                                        </Tooltip>
                                    }>
                        <div onClick={() => {
                                this.setState({open: !this.state.open});
                             }}
                             style={{display: this.props.carouselShow ? 'block' : 'none'}}
                             className={this.state.open ? 'carouselListTitle toolbarSpread' : 'carouselListTitle toolbarHide'}>
                            <div className="toolbarTitle">
                                <i className="material-icons">settings</i>
                                <span className="toolbarTitletxt">
                                    {i18n.t('Properties')}
                                </span>
                            </div>
                            <div className="pluginTitleInToolbar">
                                {toolbar.config.displayName || ""}
                            </div>
                        </div>
                    </OverlayTrigger>
                    <div id="insidetools" style={{display: this.state.open ? 'block' : 'none'}}>
                        <div className="toolbarTabs">
                            {Object.keys(toolbar.controls).map((tabKey, index) => {
                                let tab = toolbar.controls[tabKey];
                                return (
                                    <div key={'key_'+index} className="toolbarTab">
                                        <PanelGroup>
                                            {Object.keys(tab.accordions).sort().map((accordionKey, index) => {
                                                return this.renderAccordion(
                                                    tab.accordions[accordionKey],
                                                    tabKey,
                                                    [accordionKey],
                                                    toolbar.state,
                                                    index
                                                );
                                            })}
                                            {this.props.box.children.map((id, index) => {
                                                let container = this.props.box.sortableContainers[id];
                                                if (tabKey === "main") {
                                                    return (
                                                        <Panel key={'panel_' + id}
                                                               className="panelPluginToolbar"
                                                               collapsible
                                                               onEnter={(panel) => {
                                                                    panel.parentNode.classList.add("extendedPanel");
                                                               }}
                                                               onExited={(panel) => {
                                                                    panel.parentNode.classList.remove("extendedPanel");
                                                               }}
                                                               header={
                                                                    <span>
                                                                        <i className="toolbarIcons material-icons">web_asset</i>
                                                                        {(toolbar.state.__pluginContainerIds && toolbar.state.__pluginContainerIds[container.key].name) ?
                                                                            toolbar.state.__pluginContainerIds[container.key].name :
                                                                            (i18n.t('Block') + ' '+ (index + 1))
                                                                        }
                                                                    </span>
                                                               }>
                                                            <GridConfigurator id={id}
                                                                              parentId={this.props.box.id}
                                                                              container={container}
                                                                              onColsChanged={this.props.onColsChanged}
                                                                              onRowsChanged={this.props.onRowsChanged}
                                                                              sortableProps={this.props.box.sortableContainers[id]}
                                                                              onSortablePropsChanged={this.props.onSortablePropsChanged}
                                                                              onSortableContainerResized={this.props.onSortableContainerResized}/>
                                                        </Panel>)
                                                }
                                            })}
                                        </PanelGroup>

                                        {textButton}
                                        {xmlButton}
                                        {configButton}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
            /* jshint ignore:end */
        );
    }

    renderAccordion(accordion, tabKey, accordionKeys, state, key) {
        let props = {
            key: key,
            className: "panelPluginToolbar",
            collapsible: true,
            onEntered: (panel) => {
                panel.parentNode.classList.add("extendedPanel");
            },
            onExited: (panel) => {
                panel.parentNode.classList.remove("extendedPanel");
            },
            header: (
                /* jshint ignore:start */
                <span key={'span' + key}>
                    <i className="toolbarIcons material-icons">
                        {accordion.icon ? accordion.icon : <span className="toolbarIcons"/>}
                    </i>{accordion.__name}
                </span>
                /* jshint ignore:end */
            )
        };
        let children = [];
        if (accordion.order) {
            for (let i = 0; i < accordion.order.length; i++) {
                if (accordion.accordions[accordion.order[i]]) {
                    children.push(this.renderAccordion(accordion.accordions[accordion.order[i]], tabKey, [accordionKeys[0], accordion.order[i]], state, i));
                } else if (accordion.buttons[accordion.order[i]]) {
                    children.push(this.renderButton(accordion, tabKey, accordionKeys, accordion.order[i], state, i));
                } else {
                    console.error("Element %s not defined", accordion.order[i]);
                }
            }
        } else {
            let buttonKeys = Object.keys(accordion.buttons);
            for (let i = 0; i < buttonKeys.length; i++) {
                let buttonWidth = (buttonKeys[i] === '__width' || buttonKeys[i] === '__height') ? '40%' : '100%';
                let buttonMargin = (buttonKeys[i] === '__width' || buttonKeys[i] === '__height') ? '5%' : '0px';
                children.push(
                    /* jshint ignore:start */
                    <div key={'div_' + i }
                         style={{
                            width: buttonWidth,
                            marginRight: buttonMargin,
                            display: 'inline-block'
                         }}>
                        {this.renderButton(accordion, tabKey, accordionKeys, buttonKeys[i], state, i)}
                    </div>
                    /* jshint ignore:end */
                );
            }
        }

        if (accordion.key === 'marks_list') {
            children.push(
                /* jshint ignore:start */
                <MarksList key="marks_list"
                           state={state}
                           onRichMarksModalToggled={this.props.onRichMarksModalToggled}
                           onRichMarkEditPressed={this.props.onRichMarkEditPressed}
                           onRichMarkDeleted={this.props.onRichMarkDeleted}/>
                /* jshint ignore:end */
            );
        }

        if (accordion.key === 'content_list') {
            children.push(
                /* jshint ignore:start */
                <ContentList key="content_list"
                             state={state}
                             box={this.props.box}
                             navItems={this.props.navItems}
                             onContainedViewSelected={this.props.onContainedViewSelected}
                             onNavItemSelected={this.props.onNavItemSelected}
                             onRichMarkDeleted={this.props.onRichMarkDeleted}/>
                /* jshint ignore:end */
            );
        }
        return React.createElement(Panel, props, children);
    }

    renderButton(accordion, tabKey, accordionKeys, buttonKey, state, key) {
        let button = accordion.buttons[buttonKey];
        if (buttonKey === '__verticalAlign') {
            return (
                /* jshint ignore:start */
                <RadioButtonFormGroup key="verticalalignment"
                                      title={button.__name}
                                      options={button.options}
                                      selected={button.value}
                                      click={(option) => {this.props.onVerticallyAlignBox(this.props.boxSelected, option)}}
                                      tooltips={button.tooltips}
                                      icons={button.icons}/>
                /* jshint ignore:end */
            );
        }
        let children;
        let id = this.props.box.id;
        let props = {
            key: ('child_' + key),
            type: button.type,
            value: button.value,
            label: button.__name,
            min: button.min,
            max: button.max,
            step: button.step,
            disabled: false,
            className: button.class,
            style: {width: '100%'},
            onBlur: e => {
                let value = e.target.value;
                if (button.type === 'number' && value === "") {
                    value = button.min ? button.min : 0;
                }

                if (!button.autoManaged) {
                    button.callback(state, buttonKey, value, id, UPDATE_TOOLBAR);
                }
            },
            onChange: e => {
                let value = e.target.value;

                if (buttonKey === '__heightAuto') {
                    let units = !isSortableContainer(this.props.box.container) ? 'px' : '%';
                    let newValue = (e.target.checked ? "auto" : (100 + units));
                    this.props.onToolbarUpdated(id, tabKey, accordionKeys, '__height', newValue);
                    this.props.onBoxResized(id, this.props.box.width, newValue);
                    return;
                }
                if (buttonKey === '__width') {
                    let units = !isSortableContainer(this.props.box.container) ? 'px' : '%';
                    let heightAuto = accordion.buttons.__heightAuto.checked;
                    if (!accordion.buttons.__aspectRatio || !accordion.buttons.__aspectRatio.checked) {
                        let newHeight = heightAuto ? "auto" : parseFloat(value, 10);
                        this.props.onBoxResized(id, value + units, this.props.box.height);
                        this.props.onToolbarUpdated(id, tabKey, accordionKeys, buttonKey, parseFloat(value, 10));
                    } else {
                        let newHeight = heightAuto ? 'auto' : (parseFloat(this.props.box.height, 10) * parseFloat(value, 10) / parseFloat(this.props.box.width, 10));
                        this.props.onBoxResized(id, value + units, heightAuto ? newHeight : (newHeight + units));
                        this.props.onToolbarUpdated(id, tabKey, accordionKeys, buttonKey, parseFloat(value, 10));
                        this.props.onToolbarUpdated(id, tabKey, accordionKeys, '__height', newHeight);
                    }
                    return;
                }
                if (buttonKey === '__height') {
                    let units = !isSortableContainer(this.props.box.container) ? 'px' : '%';
                    if (!accordion.buttons.__aspectRatio || !accordion.buttons.__aspectRatio.checked) {
                        this.props.onBoxResized(id, this.props.box.width, value + units);
                        this.props.onToolbarUpdated(id, tabKey, accordionKeys, buttonKey, parseFloat(value, 10));
                    } else {
                        let newWidth = (parseFloat(this.props.box.width, 10) * parseFloat(value, 10) / parseFloat(this.props.box.__height, 10));
                        this.props.onBoxResized(id, newWidth + units, value + units);
                        this.props.onToolbarUpdated(id, tabKey, accordionKeys, buttonKey, parseFloat(value, 10));
                        this.props.onToolbarUpdated(id, tabKey, accordionKeys, '__width', newWidth);
                    }
                    return;
                }

                if (button.type === 'number') {
                    //If there's any problem when parsing (NaN) -> take min value if defined; otherwise take 0
                    value = parseInt(value, 10) || button.min || 0;

                    if (button.max && value > button.max) {
                        value = button.max;
                    }
                }

                if (button.type === 'checkbox') {
                    value = ( value === 'checked') ? 'unchecked' : 'checked';
                }
                if (button.type === 'radio') {
                    value = button.options[value];
                    if (buttonKey === '__position') {
                        this.props.onToolbarUpdated(id, tabKey, accordionKeys, '__position', value);
                        this.props.onBoxMoved(id, 0, 0, value);
                    }
                }

                if (button.type === 'select' && button.multiple === true) {
                    value = button.value;
                    let ind = button.value.indexOf(e);
                    value = e;  //[...e.target.options].filter(o => o.selected).map(o => o.value);
                }
                /*                if (buttonKey == 'borderRadius'){
                 value = value + '%';
                 }*/
                if (button.type === 'colorPicker') {
                    value = e.value;
                }
                this.props.onToolbarUpdated(id, tabKey, accordionKeys, buttonKey, value);

                if (!button.autoManaged) {
                    button.callback(state, buttonKey, value, id, UPDATE_TOOLBAR);
                }
            }

        };

        if (buttonKey === '__height') {
            let heightAuto = accordion.buttons.__heightAuto.value === "checked";

            props.value = heightAuto ? 'auto' : parseFloat(this.props.box.height, 10);
            props.type = heightAuto ? 'text' : 'number';
            props.disabled = heightAuto;
        }
        if (buttonKey === '__width') {
            props.value = parseFloat(this.props.box.width, 10);
        }
        if (button.options && button.type === 'colorPicker') {
            props.options = button.options;
            props.optionRenderer = this.renderOption;
            props.valueRenderer = this.renderValue;
            return React.createElement(FormGroup, {key: button.__name}, [React.createElement(ControlLabel, {key: 'label_' + button.__name}, button.__name),
                React.createElement(Select, props, null)]);

        }

        if (button.options && button.type === 'select') {
            if (!button.multiple) {
                button.options.map((option, index) => {
                    if (!children) {
                        children = [];
                    }
                    children.push(React.createElement('option', {key: 'child_' + index, value: option}, option));
                });
                props.componentClass = 'select';

                return React.createElement(FormGroup, {key: button.__name}, [React.createElement(ControlLabel, {key: 'label_' + button.__name}, button.__name),
                    React.createElement(FormControl, props, children)]);

            } else {
                props.multiple = 'multiple';
                props.options = button.options;
                props.multi = true;
                props.simpleValue = true;
                props.placeholder = "No has elegido ninguna opción";
                return React.createElement(FormGroup, {key: button.__name}, [React.createElement(ControlLabel, {key: 'label_' + button.__name}, button.__name),
                    React.createElement(Select, props, null)]);
            }


        } else if (button.type === 'checkbox') {
            props.checked = button.value === 'checked';
            return React.createElement(FormGroup, {key: (button.__name)},
                React.createElement(Checkbox, props, button.__name));

        } else if (button.options && button.type === 'radio') {
            button.options.map((radio, index) => {
                if (!children) {
                    children = [];
                    children.push(React.createElement(ControlLabel, {key: 'child_' + index}, button.__name));
                }
                children.push(React.createElement(Radio, {
                    key: index,
                    name: button.__name,
                    value: index,
                    id: (button.__name + radio),
                    onChange: props.onChange,
                    checked: (button.value === button.options[index])
                }, radio));
            });
            return React.createElement(FormGroup, props, children);
        } else if (button.type === "vish_provider") {
            return React.createElement(VishProvider, {
                key: ('key' + button.__name),
                formControlProps: props,
                isBusy: this.props.isBusy,
                fetchResults: this.props.fetchResults,
                onFetchVishResources: this.props.onFetchVishResources,
                onUploadVishResource: this.props.onUploadVishResource,
                onChange: props.onChange
            }, null);
        } else {
            return React.createElement(
                FormGroup,
                {key: ('key' + button.__name)},
                [
                    React.createElement(
                        ControlLabel,
                        {key: 'label_' + button.__name},
                        button.__name),
                    React.createElement(
                        "span",
                        {key: 'output_span' + button.__name, className: 'rangeOutput'},
                        button.type === "range" ? "   " + button.value : null),
                    React.createElement(
                        FormControl,
                        props,
                        null)
                ]
            );
        }
    }

    renderOption(option) {
        return (
            /* jshint ignore:start */
            <span>{option.label}<i style={{color: option.color, float: 'right'}} className="fa fa-stop"></i></span>
            /* jshint ignore:end */
        );
    }

    renderValue(option) {
        return (
            /* jshint ignore:start */
            <span>{option.label}</span>
            /* jshint ignore:end */
        );
    }
}