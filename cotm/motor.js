
var sound_lib = {
    'subway-station-escalator.wav': new Howl ({
        src: ['sounds/subway-station-escalator.wav'],
        loop: true,
        volume: 1,
        onfade() {
            
        },
    }),
    'train-arrival-at-station.wav': new Howl ({
        src: ['sounds/train-arrival-at-station.wav'],
        loop: false,
        volume: 1,
    }),
    'train-door-close.wav': new Howl ({
        src: ['sounds/train-door-close.wav'],
        loop: false,
        volume: 1,
    }),
    'train-station-depart-ambience.wav': new Howl ({
        src: ['sounds/train-station-depart-ambience.wav'],
        loop: true,
        volume: 1,
    }),
};
var last_ambiance = "";

class StoryParagraph {
    constructor(value, tags) {
        this.value = value;
        this.tags = tags;
    }
}

class Choices extends StoryParagraph {
}

class StoryMotor {
    constructor(story, storyContainer, outerScrollContainer) {
        this.story = story;
        this.storyContainer = storyContainer;
        this.outerScrollContainer = outerScrollContainer;

        this.gatheredStory = [];
        this.currentVoice = "";
        this.lastVoice = "";
    }

    start() {
        this.gatherStory();
        this.continue(true);
    }

    _add_continue_button() {
        var choiceParagraphElement = document.createElement('p');
        choiceParagraphElement.classList.add("choice");
        choiceParagraphElement.innerHTML = `<a href='#'>CONTINUE >>></a>`

        choiceParagraphElement.addEventListener("click", (event) => {
            event.preventDefault();
            removeAll(".choice", this.storyContainer);
            this.continue();
        });
        this.storyContainer.appendChild(choiceParagraphElement);
    }

    _next_in_gathered_is_choices() {
        return this.gatheredStory[0] instanceof Choices;
    }
    
    continue(firstTime) {
        Array.from(document.querySelectorAll('.latest')).forEach((el) => el.classList.remove('latest'));

        while(this.gatheredStory.length > 0) {
            let first = this.gatheredStory.shift();
            let second = this.gatheredStory[0];
        
            if (first instanceof Choices) {
                first.value.forEach((v)=>{
                    let [p, c] = v;
                    this.storyContainer.appendChild(p);
                    p.addEventListener("click", (event) => {
                        event.preventDefault();
                        removeAll(".choice", this.storyContainer);
                        this.story.ChooseChoiceIndex(c.index);

                        this.gatherStory();
                        this.continue();
                    });

                });
                this.storyContainer.style.minHeight = contentBottomEdgeY(this.storyContainer)+"px";
                scrollDown(this.outerScrollContainer);
            } else {

                let skill_result_el = false;//first.value.querySelector('.skill-result');
                if (skill_result_el) {
                    document.querySelector("body").classList.add("rolling");
                    window.setTimeout(()=>{
                        document.querySelector("body").classList.remove("rolling");
                        
                        if (first.value.querySelector('.skill-result').classList.contains("success"))
                            document.querySelector("body").classList.add("success");
                        else
                            document.querySelector("body").classList.add("failure");

                        this.storyContainer.appendChild(first.value);

                        window.setTimeout(()=>{
                            this.storyContainer.style.minHeight = contentBottomEdgeY(this.storyContainer)+"px";
                            scrollDown(this.outerScrollContainer);
                        }, 0);
                        
                        window.setTimeout(()=>{
                            document.querySelector("body").classList.remove("success");
                            document.querySelector("body").classList.remove("failure");
                        }, 900);

                        if(this._next_in_gathered_is_choices()) {
                            this.continue();
                        } else {
                            this._add_continue_button();
                            window.setTimeout(()=>{
                                this.storyContainer.style.minHeight = contentBottomEdgeY(this.storyContainer)+"px";
                            }, 0);
                        }

                    }, 1000);
                    break;
                } else {
                    first.value.classList.add('latest');
                    this.storyContainer.appendChild(first.value);
                    
                    let totStart = first.tags.indexOf("trainOfThoughtStart");
                    let totEnd = first.tags.indexOf("trainOfThoughtEnd");

                    if (totStart >= 0) {
                        this.outerScrollContainer.classList.add('tot');
                    }
                    if (totEnd >= 0) {
                        this.outerScrollContainer.classList.remove('tot');
                    }

                    let ambiance_tag = first.tags.find((v)=>v.startsWith("ambiance:"));
                    if (ambiance_tag) {
                        console.log(ambiance_tag);
                        let ambiance_name = ambiance_tag.split(":")[1];
                        if (last_ambiance != ambiance_name) {
                            if (sound_lib[last_ambiance]) {
                                sound_lib[last_ambiance].fade(1, 0, 1000);
                                //sound_lib[last_ambiance].stop();
                            }
                            last_ambiance = ambiance_name;
                        }
                        let delay_tag = first.tags.find((v)=>v.startsWith("delay:"));
                        if(delay_tag) {
                            console.log("delay", delay_tag);
                            let delay = parseInt(delay_tag.split(":")[1]);
                            setTimeout(()=>{
                                sound_lib[ambiance_name].fade(0, 1, 1000);
                                sound_lib[ambiance_name].play();
                            }, delay);
                        } else {
                            sound_lib[ambiance_name].fade(0, 1, 1000);
                            sound_lib[ambiance_name].play();
                        }
                    }
                    let sound_tag = first.tags.find((v)=>v.startsWith("sound:"));
                    if (sound_tag) {
                        console.log(sound_tag);
                        let sound_name = sound_tag.split(":")[1];
                        sound_lib[sound_name].play();
                    }

                    window.setTimeout(()=>{
                        this.storyContainer.style.minHeight = contentBottomEdgeY(this.storyContainer)+"px";
                        scrollDown(this.outerScrollContainer);
                    }, 0);
                }
                
                if (second.value.querySelector && second.value.querySelector('.skill-result')) {
                    this._add_continue_button();
                    window.setTimeout(()=>{
                        this.storyContainer.style.minHeight = contentBottomEdgeY(this.storyContainer)+"px";
                        scrollDown(this.outerScrollContainer);
                    }, 0);
                    break;
                }

            }
        }
    }

    gatherStory() {
        while(this.story.canContinue) {
            function parseTags(tags_text) {
                let split_space = tags_text.join(" ").split(" ");
                return split_space
            }
            var paragraphText = this.story.Continue();
            let tags = parseTags(this.story.currentTags);
            for (let idx in tags) {
                let t = tags[idx];
                if (t.startsWith("voice:")) {
                    let voice = t.split(":")[1];
                    this.currentVoice = voice;
                    break;
                }
            }
            if (this.currentVoice != "" && this.currentVoice != "narrator") {
                if (this.lastVoice != this.currentVoice) {
                    this.lastVoice = this.currentVoice;

                    paragraphText = `<span class='voice ${this.currentVoice.toLowerCase()}'>${this.currentVoice}</span> - ` + paragraphText;
                }
            }
            var paragraphElement = document.createElement('p');

            paragraphElement.innerHTML = paragraphText;
            this.gatheredStory.push(new StoryParagraph(paragraphElement, this.story.currentTags.map((t) => t.split(" ")).flat()));
        }

        var choices = [];
        this.story.currentChoices.forEach((choice) => {
            var choiceParagraphElement = document.createElement('p');
            choiceParagraphElement.classList.add("choice");

            var choiceVisitCount = this.story.state.VisitCountAtPathString(choice.pathStringOnChoice);
            console.log(choice.pathStringOnChoice, choiceVisitCount);
            if(choiceVisitCount > 0) {
                choiceParagraphElement.classList.add("visited");
            }

            if (choice.text.indexOf("[>]")!=-1) {
                choice.text = choice.text.replace("[>]", "");
                choice.text = "<span class='continues-scene'>[➡️] </span>"+choice.text;
            }
            if (choice.text.indexOf("[e]")!=-1) {
                choice.text = choice.text.replace("[e]", "");
                choice.text = "<span class='explores-scene'>[🔍] </span>"+choice.text;
            }

            choiceParagraphElement.innerHTML = `<a href='#'>${choice.text}</a>`
            choices.push([choiceParagraphElement, choice]);
        });
        this.gatheredStory.push(new Choices(choices, null));
    }
}

function removeAll(selector, container)
{
    var allElements = container.querySelectorAll(selector);
    for(var i=0; i<allElements.length; i++) {
        var el = allElements[i];
        el.parentNode.removeChild(el);
    }
}

function contentBottomEdgeY(container) {
    var bottomElement = container.lastElementChild;
    return bottomElement ? bottomElement.offsetTop + bottomElement.offsetHeight : 0;
}

function scrollDown(outerScrollContainer) {

    // Can't go further than the very bottom of the page
    var limit = outerScrollContainer.scrollHeight - outerScrollContainer.clientHeight;
    //if( target > limit ) 
    var target = limit;

    var start = outerScrollContainer.scrollTop;

    var dist = target - start;
    var duration = 300 + 300*dist/100;
    var startTime = null;
    function step(time) {
        if( startTime == null ) startTime = time;
        var t = (time-startTime) / duration;
        var lerp = 3*t*t - 2*t*t*t; // ease in/out
        outerScrollContainer.scrollTo(0, (1.0-lerp)*start + lerp*target);
        if( t < 1 ) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
}

(function(storyContent) {

    var story = new inkjs.Story(storyContent);

    /*story.BindExternalFunction("npc_dialog_prefix_ext", (name) => {
        return "<span class='npc-prefix'>"+name+"</span>";
    });

    story.BindExternalFunction("skill_dialog_prefix_ext", (name) => {
        return "<span class='skill-prefix'>"+name+"</span>";
    });

    story.BindExternalFunction("player_prefix_ext", (name) => {
        return "<span class='player-prefix'>"+name+"</span>";
    });*/

    story.BindExternalFunction("format_stat_name", (stat) => {
        let stat_to_class = stat.maxItem.Key.itemName.toLowerCase();
        return `<span class='stat-name ${stat_to_class}'>${stat.maxItem.Key.itemName}</span>`;
    });

    var storyContainer = document.querySelector('#story');
    var outerScrollContainer = document.querySelector('.outerContainer');

    var storyMotor = new StoryMotor(story, storyContainer, outerScrollContainer);
    storyMotor.start();

}(storyContent));