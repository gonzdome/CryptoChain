import React, { Component } from "react";
import Block from "./Block";
import { Link } from "react-router-dom";

class Blocks extends Component {
    state = { blocks: [] };

    componentDidMount() {
        fetch(`${document.location.origin}/api/blocks`)
            .then(response => response.json())
            .then(blocks => this.setState({ blocks }));
    }

    render() {
        return (
            <div className="Blockchain">
                <h3>Blockchain</h3>

                <br />
                <Link to="/">Home</Link>
                <br />

                {
                    this.state.blocks.map((block, index) =>
                        <Block key={block.hash} block={block} />
                    )
                }
            </div>
        );
    };
};

export default Blocks;