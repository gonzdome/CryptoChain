import React, { Component } from "react";
import Block from "./Block";

class Blocks extends Component {
    state = { blocks: [] };

    componentDidMount() {
        fetch(`${process.env.URL}${process.env.PORT}/api/blocks`)
            .then(response => response.json())
            .then(blocks => this.setState({ blocks }));
    }

    render() {
        return (
            <div>
                <h3>Blockchain</h3>
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