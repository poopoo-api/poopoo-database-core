// client.on("messageCreate", async (message) => {
//     if (message.author.bot) return;
//     var isMuted = false;
//     try {
//         let res = await axios.get(
//             `http://api.brainshop.ai/get?bid=169114&key=7pq1YNb9Jegvf0BF&uid=1&msg=${encodeURIComponent(message.content)}`
//         );
//     if (message.content == "> mute") {
//       message.reply("muted. > unmute for unmute");
//       isMuted = true;
//     } else if (message.content == "> unmute") {
//       isMuted = false;
//     }
//         if(isMuted === false) {
//           message.reply(res.data.cnt);
//         }
//       } catch {
//         message.reply(`Glitch Matrix:`, message)
//       }

// // you dont need a discord bot ik lol im just fixing some code for a friend