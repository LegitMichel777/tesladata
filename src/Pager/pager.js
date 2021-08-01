import React from 'react';
import PropTypes from 'prop-types';
import { getIcon } from '../utils';
import './pager.css';

export default class Pager extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            textFieldPage: this.props.currentPage,
        };
    }

    componentDidUpdate(prevProps) {
        if (prevProps.currentPage !== this.props.currentPage) {
            // eslint-disable-next-line react/no-did-update-set-state
            this.setState({
                textFieldPage: this.props.currentPage,
            });
        }
    }

    render() {
        if (this.props.pages === 0) {
            return (<div />);
        }
        return (
            <div id="pager-master">
                <div id="pager-currentPageDisplay">
                    <span>Page</span>
                    <input
                        id="pager-input"
                        min="1"
                        max={this.props.pages}
                        value={this.state.textFieldPage}
                        onChange={(val) => {
                            this.setState({
                                textFieldPage: val.target.value,
                            });
                        }}
                        onKeyDown={(event) => {
                            if (event.key!=='Enter') {
                                return;
                            }
                            let val=this.state.textFieldPage;
                            if (isNaN(val)) {
                                this.setState({
                                    textFieldPage: this.props.currentPage,
                                });
                                return;
                            }
                            let num=Number.parseInt(val, 10);
                            if (num>=1 && num<=this.props.pages) {
                                this.props.setPage(num);
                            } else {
                                this.setState({
                                    textFieldPage: this.props.currentPage,
                                });
                            }
                        }}
                        onBlur={() => {
                            this.setState({
                                textFieldPage: this.props.currentPage,
                            });
                        }}
                    />
                    <span>{`of ${this.props.pages}`}</span>
                </div>
                <div id="pager-adjust">
                    <div
                        className={`pager-adjust-buttons ${this.props.currentPage>1 ? 'pager-adjust-buttons-enabled' : 'pager-adjust-buttons-disabled'}`}
                        onClick={() => {
                            if (this.props.currentPage>1) {
                                this.props.setPage(this.props.currentPage-1);
                            }
                        }}
                    >
                        <img className={`pager-adjust-icon${this.props.currentPage>1 ? '' : ' pager-adjust-icon-disabled'}`} alt="Last Page" src={getIcon("LeftArrow")} />
                    </div>
                    <div
                        className={`pager-adjust-buttons ${this.props.currentPage<this.props.pages ? 'pager-adjust-buttons-enabled' : 'pager-adjust-buttons-disabled'}`}
                        onClick={() => {
                            if (this.props.currentPage<this.props.pages) {
                                this.props.setPage(this.props.currentPage+1);
                            }
                        }}
                    >
                        <img className={`pager-adjust-icon${this.props.currentPage<this.props.pages ? '' : ' pager-adjust-icon-disabled'}`} alt="Next Page" src={getIcon("RightArrow")} />
                    </div>
                </div>
            </div>
        );
    }
}

Pager.propTypes = {
    currentPage: PropTypes.number.isRequired,
    pages: PropTypes.number.isRequired,
    setPage: PropTypes.func.isRequired,
};
