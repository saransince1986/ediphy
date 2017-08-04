import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import BoxVisor from './BoxVisor';
import BoxSortableVisor from './BoxSortableVisor';
import { Col } from 'react-bootstrap';
import HeaderVisor from './HeaderVisor';
import { isSortableBox, isSection, isView } from './../../../utils';

export default class CanvasVisorDoc extends Component {

    render() {
        let titles = [];
        let itemSelected = this.props.navItems[this.props.currentView] || this.props.containedViews[this.props.currentView];
        let isCV = !isView(this.props.currentView);
        if (itemSelected !== 0 && !isCV) {
            titles.push(itemSelected.name);
            let parent = itemSelected.parent;
            while (parent !== 0) {
                titles.push(this.props.navItems[parent].name);
                parent = this.props.navItems[parent].parent;
            }
            titles.reverse();
        }

        let maincontent = isCV ? document.getElementById('contained_maincontent') : document.getElementById('maincontent');
        let actualHeight;
        if (maincontent) {
            actualHeight = parseInt(maincontent.scrollHeight, 10);
            actualHeight = (parseInt(maincontent.clientHeight, 10) < actualHeight) ? (actualHeight) + 'px' : '100%';
        }

        let overlayHeight = actualHeight ? actualHeight : '100%';
        let boxes = isCV ? this.props.containedViews[this.props.currentView].boxes || [] : this.props.navItems[this.props.currentView].boxes || [];
        return (
            /* jshint ignore:start */

            <Col id={isCV ? "containedCanvas" : "canvas"} md={12} xs={12}
                style={{ display: 'initial', padding: '0', width: '100%' }}>
                <div className="scrollcontainer">
                    {isCV ? (<a href="#" className="btnOverBar cvBackButton" style={{ pointerEvents: this.props.viewsArray.length > 1 ? 'initial' : 'none', color: this.props.viewsArray.length > 1 ? 'black' : 'gray' }} onClick={a => {
                        this.props.removeLastView();
                        a.stopPropagation();
                    }}><i className="material-icons">close</i></a>) : (<span />)}
                    <HeaderVisor titles={titles}
                        onShowTitle={()=>this.setState({ showTitle: true })}
                        courseTitle={this.props.title}
                        titleMode={itemSelected.titleMode}
                        navItems={this.props.navItems}
                        currentView={this.props.currentView}
                        containedViews={this.props.containedViews}
                        titleModeToggled={this.props.titleModeToggled}
                        onUnitNumberChanged={this.props.onUnitNumberChanged}
                        showButton/>
                    <div className="outter canvasvisor">
                        <div id={isCV ? 'airlayer_cv' : 'airlayer'}
                            className={'doc_air'}
                            style={{ visibility: (this.props.showCanvas ? 'visible' : 'hidden') }}>

                            <div id={isCV ? "contained_maincontent" : "maincontent"}
                                onClick={e => {
                                    this.setState({ showTitle: false });
                                }}
                                className={'innercanvas doc'}
                                style={{ visibility: (this.props.showCanvas ? 'visible' : 'hidden') }}>

                                <br/>

                                <div style={{
                                    width: "100%",
                                    background: "black",
                                    height: overlayHeight,
                                    position: "absolute",
                                    top: 0,
                                    opacity: 0.4,
                                    display: (this.props.boxLevelSelected > 0) ? "block" : "none",
                                    visibility: (this.props.boxLevelSelected > 0) ? "visible" : "collapse",
                                }} />

                                {boxes.map(id => {
                                    let box = this.props.boxes[id];
                                    if (!isSortableBox(box.id)) {
                                        return <BoxVisor key={id}
                                            id={id}
                                            boxes={this.props.boxes}
                                            boxSelected={this.props.boxSelected}
                                            boxLevelSelected={this.props.boxLevelSelected}
                                            changeCurrentView={(element)=>{this.props.changeCurrentView(element);}}
                                            currentView={this.props.currentView}
                                            toolbars={this.props.toolbars}
                                            richElementsState={this.props.richElementsState}/>;
                                    }
                                    return <BoxSortableVisor key={id}
                                        id={id}
                                        boxes={this.props.boxes}
                                        boxSelected={this.props.boxSelected}
                                        boxLevelSelected={this.props.boxLevelSelected}
                                        changeCurrentView={this.props.changeCurrentView}
                                        currentView={this.props.currentView}
                                        toolbars={this.props.toolbars}
                                        richElementsState={this.props.richElementsState}/>;

                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </Col>
            /* jshint ignore:end */
        );
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.boxSelected !== -1) {
            this.setState({ showTitle: false });
        }
        if (this.props.currentView.id !== nextProps.currentView.id) {
            document.getElementById(!isView(this.props.currentView) ? "contained_maincontent" : "maincontent").scrollTop = 0;
        }
    }

}
