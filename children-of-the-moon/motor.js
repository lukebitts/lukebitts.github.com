class StoryParagraph {
    constructor(value) {
        this.value = value;
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
        //this.storyContainer.style.minHeight = contentBottomEdgeY(this.storyContainer)+"px";

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

                let skill_result_el = first.value.querySelector('.skill-result');
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
                        }, 500);

                        if(this._next_in_gathered_is_choices()) {
                            this.continue();
                        } else {
                            this._add_continue_button();
                            window.setTimeout(()=>{
                                this.storyContainer.style.minHeight = contentBottomEdgeY(this.storyContainer)+"px";
                            }, 0);
                        }

                    }, 500);
                    break;
                } else {
                    this.storyContainer.appendChild(first.value);
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
            var paragraphText = this.story.Continue();
            var paragraphElement = document.createElement('p');

            paragraphElement.innerHTML = paragraphText;
            this.gatheredStory.push(new StoryParagraph(paragraphElement));
        }

        var choices = [];
        this.story.currentChoices.forEach(function(choice) {
            var choiceParagraphElement = document.createElement('p');
            choiceParagraphElement.classList.add("choice");
            choiceParagraphElement.innerHTML = `<a href='#'>${choice.text}</a>`
            choices.push([choiceParagraphElement, choice]);
        });
        this.gatheredStory.push(new Choices(choices));
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

    story.BindExternalFunction("npc_dialog_prefix_ext", (name) => {
        return "<span class='npc-prefix'>"+name+"</span>";
    });

    story.BindExternalFunction("skill_dialog_prefix_ext", (name) => {
        return "<span class='skill-prefix'>"+name+"</span>";
    });

    story.BindExternalFunction("player_prefix_ext", (name) => {
        return "<span class='player-prefix'>"+name+"</span>";
    });

    var storyContainer = document.querySelector('#story');
    var outerScrollContainer = document.querySelector('.outerContainer');

    var storyMotor = new StoryMotor(story, storyContainer, outerScrollContainer);
    storyMotor.start();

}(storyContent));