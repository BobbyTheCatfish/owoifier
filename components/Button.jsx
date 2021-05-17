const { React, getModuleByDisplayName, getModule } = require("powercord/webpack");
const Tooltip = getModuleByDisplayName("Tooltip", false);
const { Button } = require("powercord/components");
const buttonClasses = getModule(["button"], false);
const buttonWrapperClasses = getModule(["buttonWrapper","pulseButton"], false);
const buttonTextAreaClasses = getModule(["button", "textArea"], false);


module.exports = () => (
    <Tooltip color='black' postion="top" text="Owoifier Off">
        {({ onMouseLeave, onMouseEnter }) => (
            <Button
                look={Button.Looks.BLANK}
                size={Button.Sizes.ICON}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
            >
                <div className={`${buttonClasses.contents} ${buttonWrapperClasses.button} ${buttonTextAreaClasses.button}`}>
                    <img
                        className={`${buttonWrapperClasses.icon}`}
                        style={{ filter: "invert(70%)" }}
                        src='https://gist.githubusercontent.com/BobbyTheCatfish/f00e257b0ddc2f6e8f122a0cf73af665/raw/2ae1ab3b5bfa3824875371edaeb6fc0162b67a60/gistfile1.svg'
                        alt="Owoifier"/>
                </div>
            </Button>
        )}
    </Tooltip>
    
);