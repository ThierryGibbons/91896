/**
*
* @authorLink https://twitter.com/LehsssVR
* @website https://github.com/ThierryGibbons/91896/tree/master/BDPlugins/externalControls
* @source https://raw.githubusercontent.com/ThierryGibbons/91896/master/BDPlugins/externalControls/externalControls.plugin.js
*
*/

/*jshint esversion: 8 */

module.exports = (() => {
    const config = {info:{name:"externalControls",authors:[{name:"Lehsss",discord_id:"262757496685330445",github_username:"ThierryGibbons",twitter_username:"LehsssVR"}],version:"0.0.1",description:"Control discord though external inputs",github:"https://github.com/ThierryGibbons/91896/tree/master/BDPlugins/externalControls/externalControls",github_raw:"https://raw.githubusercontent.com/ThierryGibbons/91896/master/BDPlugins/externalControls/externalControls.plugin.js"},changelog:[{title:"Chur", type:"chur",items:["run faster","dont walk"]}],main:"index.js"};

    return !global.ZeresPluginLibrary ? class {
      constructor() {this._config = config;}
      getName() {return config.info.name;}
      getAuthor() {return config.info.authors.map(a => a.name).join(",");}
      getDescription() {return config.info.description;}
      getVersion() {return config.info.version;}
      load() {
          BdApi.showConfirmationModal("Library Missing", `The library plugin needed for ${config.info.name} is missing. Please click Download Now to instal it.`, {
              confirmText: "Download Now",
              cancelText: "Cancel",
              onConfirm: () => {
                require("request").get("https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js", async (error, response, body) => {
                  if (error) return require("electron").shell.openExternal("https://betterdiscord.net/ghdl?url=https://raw.githubusercontent.com/rauenzi/BDPluginLibrary/master/release/0PluginLibrary.plugin.js");
                  await new Promise(r => require("fs").writeFile(require("path").join(BdApi.Plugins.folder, "0PluginLibrary.plugin.js"), body, r));
                });
              }
          });
      }
      start() {}
      stop() {}
    } : (([Plugin, Api]) => {         //From here down is not my code: Github user Zerebos, SendButton plugin
        const plugin = (Plugin, Api) => {
    const buttonHTML = `<div class="buttonContainer-28fw2U da-buttonContainer send-button">
    <button aria-label="Send Message" tabindex="0" type="button" class="buttonWrapper-1ZmCpA da-buttonWrapper button-38aScr da-button lookBlank-3eh9lL colorBrand-3pXr91 grow-q77ONN da-grow noFocus-2C7BQj da-noFocus">
        <div class="contents-18-Yxp da-contents button-3AYNKb da-button button-318s1X da-button">
            <svg xmlns="http://www.w3.org/2000/svg" class="icon-3D60ES da-icon" viewBox="0 0 24 24" aria-hidden="false" fill="currentColor" width="24px" height="24px">
                <path d="M0 0h24v24H0z" fill="none"/>
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
            </svg>
        </div>
    </button>
</div>`;

    const press = new KeyboardEvent("keydown", {key: "Enter", code: "Enter", which: 13, keyCode: 13, bubbles: true});
    Object.defineProperties(press, {keyCode: {value: 13}, which: {value: 13}});

    const {DiscordSelectors, PluginUtilities, DOMTools, Logger} = Api;
    return class SendButton extends Plugin {
        onStart() {
            const form = document.querySelector("form");
            if (form) this.addButton(form);
        }

        onStop() {
            const button = document.querySelector(".send-button");
            if (button) button.remove();
            PluginUtilities.removeStyle(this.getName());
        }

        addButton(form) {
            if (form.querySelector(".send-button")) return;
            const button = DOMTools.createElement(buttonHTML);
            form.querySelector(DiscordSelectors.Textarea.buttons).append(button);
            button.addEventListener("click", () => {
                const textareaWrapper = form.querySelector(DiscordSelectors.Textarea.textArea);
                if (!textareaWrapper) return Logger.warn("Could not find textarea wrapper");
                const textarea = textareaWrapper.children && textareaWrapper.children[0];
                if (!textarea) return Logger.warn("Could not find textarea");
                textarea.dispatchEvent(press);
            });
        }

        observer(e) {
            if (!e.addedNodes.length || !e.addedNodes[0] || !e.addedNodes[0].querySelector) return;
            const form = e.addedNodes[0].querySelector(DiscordSelectors.Textarea.inner);
            if (form) this.addButton(form);
        }

    };
};
        return plugin(Plugin, Api);
    })(global.ZeresPluginLibrary.buildPlugin(config));
})();
