import * as React from "react";

export class ButtonBar extends React.Component<React.Props<any>, {}>
{
    public render()
    {
        return (
            <div id="button-bar-container">
                {this.props.children}
            </div>
        );
    }
}