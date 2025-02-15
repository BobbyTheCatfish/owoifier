const { Plugin } = require('powercord/entities');
const { getModule, React } = require('powercord/webpack');
const { inject, uninject} = require('powercord/injector');
const { findInReactTree } = require('powercord/util');
const Settings = require('./components/Settings');
const Button = require('./components/Button');
const Button2 = require('./components/Button2.jsx')
let owoifierAutoToggle = false;


module.exports = class Owoify extends Plugin { 

  async startPlugin () {
    this.addButton();
    powercord.api.settings.registerSettings(this.entityID, {
      category: this.entityID,
      label: 'Owoifier',
      render: (props) => React.createElement(Settings, {
        main:this,
        ...props
      })
    }); 

    const getSetting = (setting, defaultValue) => this.settings.get(setting, defaultValue);

    function owoifyText(v) {
      var words = v.split(' ');
      var output = '';

      let toggleFaces = getSetting('enableFaces');

      for (let index = 0; index < words.length; index++) {
        const element = words[index];
        if (!element.startsWith('<@') && !element.startsWith('<#') && !element.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g)) {
          let format_string = element
          .replace(/(?:r|l)/g, "w")
          .replace(/(?:R|L)/g, "W")
          .replace(/(n)([aeiou])/gi, '$1y$2')
          .replace(/ove/g, "uv")
          .replace(/th/g, "ff");

          if (toggleFaces) {
            let faceList = getSetting('owoifierFaces');            
            format_string = format_string.replace(/\!+/g, " " + faceList[Math.floor(Math.random() * faceList.length)].name + " ");            
          }

          output += format_string + ' '
        } else {
          output += element + ' '
        }
      }

      return output
    }
    
    const messageEvents = await getModule(["sendMessage"]);
    inject("owoifierSend", messageEvents, "sendMessage", function(args) {
      if(owoifierAutoToggle) {
        let text = args[1].content;
        text = owoifyText(text);
        args[1].content = text;      
      }      
      return args;  
    }, true);

    powercord.api.commands.registerCommand({
      command: 'owoify',
      description: 'owoify your message',
      usage: '{c} [ text ]',
      executor: (args) => ({send: true, result: owoifyText(args.join(' '))})
    });
    powercord.api.commands.registerCommand({
      command: 'owoifyauto',
      description: `owoify all of your messages`,
      executor: this.toggleAuto.bind(this)
    });    
  }

  addButton() {    
    const ChannelTextAreaContainer = getModule(
        m =>
            m.type &&
            m.type.render &&
            m.type.render.displayName === "ChannelTextAreaContainer",
        false
    );
    inject(
        "owoifierButton",
        ChannelTextAreaContainer.type,
        "render",
        (args, res) => {
            const props = findInReactTree(
                res,
                r => r && r.className && r.className.indexOf("buttons-") === 0
            );
        
            const element = React.createElement(
                "div",
                {
                    key: owoifierAutoToggle,
                    className: ".owoifierButton",
                    onClick: () => {
                      this.toggleAuto()
                    },
                },
                React.createElement(owoifierAutoToggle == true ? Button2 : Button)
            );
            
            const btnEnb = this.settings.get("buttonEnabled", true);
            const posSetting = this.settings.get("buttonPos", false);
            if(btnEnb) {posSetting ? props.children.push(element) : props.children.unshift(element);}
            return res;
        }
    );
    ChannelTextAreaContainer.type.render.displayName = "ChannelTextAreaContainer";
}

  pluginWillUnload() {
    powercord.api.settings.unregisterSettings(this.entityID);
    uninject("owoifierSend"); 
    powercord.api.commands.unregisterCommand('owoifyauto');   
    powercord.api.commands.unregisterCommand('owoify');   
    uninject("owoifierButton");
    const button = document.querySelector('.owoifierButton');
    if(button) button.remove();
  }

  toggleAuto () {
    owoifierAutoToggle = !owoifierAutoToggle;
    //powercord.api.notices.sendToast('owoifyNotif', {
      //header: `Owoify Auto Status`,
      //content: `${(owoifierAutoToggle == true) ? 'Its weady to go >w<' : 'Ok chill we are back to normal again.'}`,
      //timeout: 1000
    //});
    /*
    const button = document.querySelector('.owoifierButton')
    if(button){
      uninject('owoifierButton')
      button.remove()
      this.addButton()

    }*/
  }
}
