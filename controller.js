YUI.add("controller", function(Y) {

    	/* Any frequently used shortcuts, strings and constants */
	var Lang = Y.Lang;

	/* Controller class constructor */
	function Controller(config) {
	    Controller.superclass.constructor.apply(this, arguments);
	}

	Controller.NAME = "controller";

	Controller.ATTRS = {
	  widgetName : {
	    value : ''
	  },
	  eventName : {
	    value : ''
	  },
	  paramsObj : {
	    value : {}
	  }
	};

	/* Controller extends the base Widget class */
	Y.extend(Controller, Y.Widget, {

		initializer: function() {			
			//publish events
			this.publish("set", {
			  broadcast: 1
			});          

			//properties 
			this.history = new Y.HistoryHash();	
			this.evtChange = false;
		},

		renderUI : function() {
			var widgetName = this.get('widgetName'),
				eventName = this.get('eventName'),
				paramsObj = this.get('paramsObj');
			if(widgetName.length > 0 && eventName.length > 0) {
				this._setFromEvent('', widgetName, eventName, paramsObj); 
			} else if (eventName.length > 0) {
				this._setFromEvent(null, null, eventName, paramsObj);				
			}
		},

		bindUI : function() {
			Y.on('history:change', this._setFromUrl, this);
	  		Y.on('controller:set', this._setFromEvent, this);
		},

	    /**
	    * Dispatches an event to the appropriate widget
	    *
	    * @method _dispatch
	    * @param widgetName {String} the name of the widget
	    * @param eventName {String} the name of the event
	    * @param paramsObj {Object} an object of params to be passed
	    * @returns fires an event to the correct widget / event
	    * @protected
	    */
	    _dispatch : function(widgetName, eventName, paramsObj) {
			if(widgetName && eventName) {
			    Y.fire(widgetName+':'+eventName, paramsObj);     
			} else if(widgetName == null && eventName) {
				Y.fire(eventName, paramsObj); 
			} 
	    },
    
	    /**
	    * Listens for an event and sets the url hash with widget / event / params and calls dispatch
	    *
	    * @method _setFromEvent
	    * @param e {Event} this
	    * @param widgetName {String} the name of the widget
	    * @param eventName {String} the name of the event
	    * @param paramsObj {Object} an object of params to be passed
	    * @param update {Bool} if false, don't update the url
	    * @returns null
	    * @protected
		* @example Y.fire('controller:set', widgetName, eventName, {'key':'value'});
	    */
	    _setFromEvent : function(e, widgetName, eventName, paramsObj, update) {
	    	var history = this.history,
	    		addObj = {};
      
			this.evtChange = true;
	  		addObj['widget'] = widgetName;
      		addObj['event'] = eventName;
      		for (var key in paramsObj) {
        		if (paramsObj.hasOwnProperty(key)) {
          			addObj[key] = paramsObj[key];
        		}
      		}
			if(update != false) { history.add(addObj, {merge: false}); }
      		this._dispatch(widgetName, eventName, paramsObj);       
	    },
    
	    /**
	    * Gets widget / event / params from url hash and calls dispatch
	    *
	    * @method _setFromUrl
	    * @param e {Event} the (browsers) hash change event
	    * @returns null
	    * @protected
	    */
	    _setFromUrl : function(e) {
	    	if (e.src === Y.HistoryHash.SRC_HASH) {
				if(this.evtChange != true) {
	        		var newVal = e.newVal,
	            	widgetName = '',
	            	eventName = '',
	            	paramsObj = {};

	        		for (var key in newVal) {
	          			if (newVal.hasOwnProperty(key)) {
	            			if(key == 'widget') {
	              				widgetName = newVal[key];
	            			}
	            			if(key == 'event') {
	              				eventName = newVal[key];
	            			}                
	            			paramsObj[key] = newVal[key];
	          			}
	        		}
	        		this._dispatch(widgetName, eventName, paramsObj);
				} else {
					this.evtChange = false;					
				}
      		}         
		}
    
	});

	Y.Controller = Controller;

}, "3.3.3", {requires:['widget', 'history']});