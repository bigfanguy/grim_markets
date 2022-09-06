//Red markets rolling

function isNumeric(str) {
    if (typeof str != "string") return false // we only process strings!  
    return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
           !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
  }

  new Dialog({
    title:'Roll Red and Black',
    content:`
      <form>
        <div class="form-group">
          <label>Roll Bonus:</label>
          <input type='text' name='rollBonus' value='0'></input>
        </div>
      </form>`,
    buttons:{
      yes: {
        icon: "<i class='fas fa-check'></i>",
        label: `Roll!`,
        callback: async html => {
          let result = html.find('input[name=\'rollBonus\']');
          let message = ``;
          if (isNumeric(result.val())) {
            let parsed = parseInt(result.val(), 10);
            if(0 >= parsed <= 20) {
                //do work
                let black = await new Roll(`1d10`).roll({async:true});
                let blackMod = black.total + parsed;
                let red = await new Roll(`1d10`).roll({async:true});
                message += `<div><span style='font-weight:bold;'>` + blackMod + ` (` + black.total + `)</span> <span style='font-weight:bold;color:red;'>` + red.total + `</span></div>`
                if(red.total == black.total) { //crit
                    if(red.total % 2 == 0){ 
                        message += `<div style='font-weight:bold;color:green;'>Critical Success</div>`;
                    }
                    else {
                        message += `<div style='font-weight:bold;color:red;'>Critical Failure</div>`;
                    }
                } else {
                    if(red.total < blackMod) {
                        message += `<div style='color:green;'>Success</div>`;
                    } else {
                        message += `<div style='color:red;'>Failure</div>`;
                    }
                }
              }
              else{
                message = 'Not between 0 and 20.';
              }
            }
            else{
                message = 'Not a number.';
            }
            let chatData = {
                user: game.user._id,
                speaker: ChatMessage.getSpeaker(),
                content: message
            };
            ChatMessage.create(chatData, {});
        }
      },
      no: {
        label: "Cancel",
        callback: () => { this.close();},
        icon: `<i class="fas fa-times"></i>`
      }
    },
    default:'yes'
  }).render(true);
