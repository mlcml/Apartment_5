

/* --- model --- */


var apt5Model = {
    
    // userid/password...
    
    roomMaps : {
        
        foyer : {
            path : {
                id : "foyer_path",  // can probably do this dynamically
                d : "m 234.27416,668.38605 0,109.57634 127.12567,0 0,-109.57634 z"
            },
            text : {
                id : "foyer_text",  // can probably do this dynamically
                x : "262.9437",
                y : "734.92761",
                text : "foyer" // maybe we don't need this
            },
            hardware : {
                ceiling_light : false // {type : light, status : off} ??
            }
        },
        
        bathroom : {
            path : {
                id : "bathroom_path",  // can probably do this dynamically
                d : "m 361.39983,777.96239 63.56283,0 0,156.53763 -270.14204,0 0,-156.53763 z"
            },
            text : {
                id : "bathroom_text",  // can probably do this dynamically
                x : "231.56026",
                y : "867.95508",
                text : "bathroom" // maybe we don't need this
            },
            hardware : {
                ceiling_light : false
            }
        },
        
        kitchen : {
            path : {
                id : "kitchen_path",  // can probably do this dynamically
                d : "m 424.96266,777.96239 0,46.96129 254.25132,0 0,-219.15268 -317.81415,0 0,172.19139 z"
            },
            text : {
                id : "kitchen_text",  // can probably do this dynamically
                x : "475.78284",
                y : "727.12177",
                text : "kitchen" // maybe we don't need this
            },
            hardware : {
                ceiling_light : false,
                counter_lamp : false
            }
        },
        
        closet : {
            path : {
                id : "closet_path",  // can probably do this dynamically
                d : "m 361.39983,605.771 0,-125.23011 317.81415,0 0,125.23011 z"
            },
            text : {
                id : "foyer_text",  // can probably do this dynamically
                x : "483.74878",
                y : "556.65833",
                text : "closet" // maybe we don't need this
            },
            hardware : {
                ceiling_light : false
            }
        },
        
        living_room : {
            path : {
                id : "living_room_path",  // can probably do this dynamically
                d : "m 361.39983,668.38605 -301.923442,0 0,-406.99784 301.923442,0 z"
            },
            text : {
                id : "living_room_text",  // can probably do this dynamically
                x : "138.20245",
                y : "471.74692",
                text : "living room" // maybe we don't need this
            },
            hardware : {
                ceiling_light : false
        
            }
        },
        
        bedroom : {
            path : {
                id : "bedroom_path",  // can probably do this dynamically
                d : "m 281.94629,261.38821 0,-203.498903 397.26769,0 0,422.651583 -317.81415,0 0,-219.15268 z"
            },
            text : {
                id : "bedroom_text",  // can probably do this dynamically
                x : "448.8587",
                y : "263.20703",
                text : "bedroom" // maybe we don't need this
            },
            hardware : {
                ceiling_light : false,
                left_bedstand_light : false,
                right_bedstand_light : false
            }
        }
    }
};

/* --- controller --- */


var apt5Controller = {
    
    init : function() { // ...initWithID
        
        floorplanView.init();
        roomControlView.init();
        
    },
    
    getRoomMaps : function() { // ...function(userID)
        
        return apt5Model.roomMaps; // ...apt5Model.userID.roomMaps
    
    },
    
    toggleHardware : function(roomID, hardwareID) {
        
        
        apt5Model.roomMaps[roomID]["hardware"][hardwareID] = !apt5Model.roomMaps[roomID]["hardware"][hardwareID];
        
    }
};

/* --- views --- */


var floorplanView = {

    init : function() {
        
        // boilerplate svg stuff?
        // apt5Controller.updateLightStatus;

        this.floorplan = document.getElementById('floorplan');
        
        this.render();
    },
    
    render : function() {
        
        var room, g, path, text, i;
        
        var roomMaps = apt5Controller.getRoomMaps();
        
        for (i = 0; i < Object.keys(roomMaps).length; i++) {
            
            // roomView.init(i);
            
            roomID = Object.keys(roomMaps)[i];
            roomData = roomMaps[roomID];
            
            path = document.createElementNS("http://www.w3.org/2000/svg", "path");
            path.setAttribute("id", roomData.path.id);
            
            // !!! FIX ME !!! FIX ME !!!!!!
            if (roomData["hardware"]["ceiling_light"]){
                console.log("made it through: " + roomData.path.id);
                path.setAttribute("class", "ceiling_light_on");
                console.log("made it all the way through");
            }
            
            // path.setAttribute("style", "fill:none; stroke:#d3d3d3; pointer-events:all");
            path.setAttribute("d", roomData.path.d);
            
            // on click, render roomControlView
            path.addEventListener("click", (function(roomIDCopy) {
                return function() {
                    roomControlView.render(roomIDCopy);
                };
            })(roomID));
            
            /*
            text = document.createElementNS("http://www.w3.org/2000/svg", "text");
            text.setAttribute("id", roomData.text.id);
            text.setAttribute("x", roomData.text.x);
            text.setAttribute("y", roomData.text.y);
            text.innerHTML = roomData.text.text;
            */
            
            g = document.createElementNS("http://www.w3.org/2000/svg", "g");
            
            g.appendChild(path);
            // g.appendChild(text);
            
            this.floorplan.appendChild(g);
        }
    }
};

var roomControlView = {
    
    init : function() {
        this.panelDiv = document.getElementById("roomControl");
    },
    
    render : function(roomID){
        this.panelDiv.innerHTML = "";
        
        var hardware, label, i;
        var roomMap = apt5Controller.getRoomMaps()[roomID]; // getRoomData?
        
        roomHeader = document.createElement("h3");
        roomHeader.innerHTML = roomID;
        this.panelDiv.appendChild(roomHeader);
        
        for (i = 0; i < Object.keys(roomMap.hardware).length; i++){
            hardwareID = Object.keys(roomMap.hardware)[i];
            
            hardwareLabel = document.createElement("p");
            
            if (roomMap["hardware"][hardwareID]){
                hardwareLabel.innerHTML = hardwareID + ": ON";
            }
            else {
                hardwareLabel.innerHTML = hardwareID + ": OFF";
            }
            
            hardwareLabel.addEventListener("click", (function(hardwareIDCopy) {
                return function() {
                    apt5Controller.toggleHardware(roomID, hardwareIDCopy);
                    floorplanView.render();
                    roomControlView.render(roomID);
                };
            })(hardwareID));
            
            this.panelDiv.appendChild(hardwareLabel);
            // this.panelDiv.appendChild(); !switch!
        }
    }
};


// roomView
// roomMenuView
// laundryMenuView
// frontGateMenuView


apt5Controller.init();










