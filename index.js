import { getFormattedChat } from "../ClientsideChat/index"
import PogObject from "../PogData"
import DiscordClient from "../discord";

let rewarping = false;

const mc = Client.getMinecraft()
const data = new PogObject("Rewarper", { rewarpPos: [], type: "netherwart:1", token: "" })
const fhPests = Java.type("com.jelly.farmhelperv2.feature.impl.PestsDestroyer")
const shift = new KeyBind(mc.field_71474_y.field_74311_E);
const client = new DiscordClient({ intents: 3276799 });
const display = Java.type("org.lwjgl.opengl.Display")
const displayMode = Java.type("org.lwjgl.opengl.DisplayMode")
const rewarp = new Thread(() => {
    Thread.sleep(1500)
    ChatLib.command("/ez-stopscript", true)
    ChatLib.command("warp garden")
    Thread.sleep(1500)
    fhPests.getInstance().start()
    rewarping = false;
})

register("command", () => {
    data.rewarpPos = [ Math.floor(Player.getX()), Math.floor(Player.getY()), Math.floor(Player.getZ()) ]
    data.save()
}).setName("rewarpset")

register("command", (arg1) => {
    data.type = arg1
    data.save()
}).setName("typeset")

register("step", () => {
    let formattedChat = getFormattedChat(2);

    formattedChat.forEach((messageContent) => {
        if (messageContent.includes("[Pests Destroyer] Stopping")) {
            fhPests.getInstance().stop()
            ChatLib.chat("[Rewarper] Pests Destroyer Stopped...")
            
            ChatLib.command("warp garden")
            ChatLib.chat("[Rewarper] Rewarping...")

            setTimeout(() => {
                shift.setState(true)
                ChatLib.command("ez-startscript " + data.type, true)
                ChatLib.chat("[Rewarper] Starting Taunahi Script...")
                setTimeout(() => {
                    shift.setState(false)
                }, 150);
            }, 1500);
        }
    })

    if(Math.floor(Player.getX()) == data.rewarpPos[0] && Math.floor(Player.getY()) == data.rewarpPos[1] && Math.floor(Player.getZ()) == data.rewarpPos[2]) {
        if(rewarping) return;
        rewarping = true;
        ChatLib.command("/ez-stopscript", true)
        rewarp.start()
    }
})

register("serverDisconnect", () => {
    Client.connect("hypixel.net")
})

register("command", (arg1) => {
    data.token = arg1
    data.save()
    ChatLib.chat("Rewarper => Token has been set, reloading ChatTriggers...")
    ChatTriggers.reloadCT()
}).setName("settoken")

client.on("ready", (user) => {
    ChatLib.chat(`Rewarper => Discord Bot Logged in as ${user.username}!`);
});

client.on("message", (message) => {
    if (message.content === '!start') {
        ChatLib.command("ez-startscript netherwart:1", true);
        message.reply("Started Taunahi Script: " + data.type + ".");
    }

    if (message.content === '!stop' || message.content === '!exit') {
        ChatLib.command("ez-stopscript", true);
        message.reply("Stopped Taunahi Script.");
    }
});

register("command", () => {
    display.setDisplayMode(new displayMode(50, 50))
    display.setResizable(true);
}).setName("smallwindow")

client.login(data.token);
