class Draggable {
    static log_template = '{object} dragging toggled {on|off}';
    constructor(id) {
        this.id = id;
        this.isDragAllowed = false;
        this.el = document.getElementById(id);
        this.isDragReady = false;
        this.dragoffset = {
            x: 0,
            y: 0
        };
        this.init();
    }
    
    init() {
        this.initPosition();
        this.events();
    };
    initPosition() {
        if (this.el.style.position !== "fixed")
        this.el.style.position = "absolute";
    };
    //events for the element
    events() {
        var self = this;
        self._on(self.el, 'mousedown', function (e) {
            if (!self.isDragAllowed) {
                self.isDragReady = false;
                return
            }
            self.isDragReady = true;
            
            self.clearSelection();
            self.initPosition();
            let pos = self.getMousePosition(e);
            self.dragoffset.x = pos.x - self.el.offsetLeft;
            self.dragoffset.y = pos.y - self.el.offsetTop;
        });
        self._on(document, 'mouseup', function () {
            self.isDragReady = false;
        });
        self._on(document, 'mousemove', function (e) {
            if (self.isDragReady) {
                if (!self.isDragAllowed) {
                    self.isDragReady = false;
                    return
                }
                
                self.clearSelection();
                self.initPosition();
                let pos = self.getMousePosition(e);
                let offsetX, offsetY;
                // left/right constraint
                if (pos.x - self.dragoffset.x < 0) {
                    offsetX = 0;
                } else if (pos.x - self.dragoffset.x + self.el.offsetWidth > document.body.clientWidth) {
                    offsetX = document.body.clientWidth - self.el.offsetWidth;
                } else {
                    offsetX = pos.x - self.dragoffset.x;
                }
                 
                // top/bottom constraint   
                if (pos.y - self.dragoffset.y < 0) {
                    offsetY = 0;
                } else if (pos.y - self.dragoffset.y + self.el.offsetHeight > document.body.clientHeight) {
                    offsetY = document.body.clientHeight - self.el.offsetHeight;
                } else {
                    offsetY = pos.y - self.dragoffset.y;
                }   

                self.el.style.top = offsetY + "px";
                self.el.style.left = offsetX + "px";
            }
        });
        self._on(window, 'selectstart', function(e) {
            if (self.isDragReady && self.isDragAllowed) {
                self.prevent(e);
            }
        });
    };

    //--- Technical functions

    //cross browser event Helper function
    _on (el, event, fn) {
        document.attachEvent ? el.attachEvent('on' + event, fn) : el.addEventListener(event, fn, !0);
    };
    getMousePosition(e) {
        //corssbrowser mouse pointer values
        return {
            x: e.pageX || e.clientX + (document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft),
            y: e.pageY || e.clientY + (document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop)
        };
    }
    dragToggle() {
        if(this.isDragAllowed) this.dragOff();
        else this.dragOn();
    }
    dragOff() {
        this.isDragAllowed = false;
        console.log(this.prepareLogMsg(`${this.el.tagName.toLocaleLowerCase()}#${this.el.id}`, 'off'))
    }
    dragOn() {
        this.isDragAllowed = true;
        console.log(this.prepareLogMsg(`${this.el.tagName.toLocaleLowerCase()}#${this.el.id}`, 'on'))
    }
    prepareLogMsg(object, onOff) {
        return Draggable.log_template.replace('{object}',object).replace('{on|off}', onOff)
    }
    prevent(event) {
        event.preventDefault();
    }
    clearSelection(){
        if (window.getSelection) {
            if (window.getSelection().empty) { window.getSelection().empty(); } // Chrome
            else if (window.getSelection().removeAllRanges) { window.getSelection().removeAllRanges(); } // Firefox
        }
        else if (document.selection) { document.selection.empty(); } // IE?
    }
}
