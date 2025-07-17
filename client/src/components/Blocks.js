import React, { Component } from "react";

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
                {/* <ul> */}
                {this.state.blocks.map((block, index) =>
                    //  (<li key={index}>
                    //     <strong>{index === 0 ? "Genesis Block" : `Block ${index}`}:</strong>
                    //     {JSON.stringify(block)}
                    // </li>)

                    <div key={block.hash} className="Block">{block.hash}</div>
                )}
                {/* </ul> */}
            </div>
        );
    }
}

export default Blocks;