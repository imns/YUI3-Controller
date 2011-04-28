YUI3 Controller
===============

This wraps around YUI3's history module to keep track of the state of your application.  This becomes useful when you are using events and widgets in your ajax driven application and want the forward / back buttons to work and you also want to be able to link directly into a url.

How To
------

You start by firing a set event to the controller widget

	Y.fire('controller:set', widgetName, eventName, {'key':'value'});

This does a couple of things.  First, it sets the current url with the history module, then it fires off the event that you specified. WidgetName and eventName corrispond to the widget and event you are calling, the third param is object containing key : value pair you want passed with your event.

The widget also listens for the hash change event ie: the forward or back button was used and fires off the appropriate events for you. 


So, a really life example would be something like this

	//update your search results
	// would set the url to: /#widget=searchResults&event=update&max=100
	Y.fire('controller:set', SearchResults, update, {'max':100});	

	//display a modal
	// would set the url to: /#event=displayModal
	Y.fire('controller:set', null, displayModal);



	

