Problems = new Mongo.Collection("problems");

if (Meteor.isClient) {
    Router.onBeforeAction(function() {
            GoogleMaps.load();
            this.next();
        }, { only: ['EditProblem'] });

    Router.route('/', function () {
            this.render('Home');
        });

    Router.route('/problems', function () {
            Template.Problems.helpers({
                    problems: function () {
                        return Problems.find();
                    }
                });

            this.render('Problems');
        });

    Router.route('/add-problem', function () {
            Template.AddProblem.helpers({
                    problems: function () {
                        return Problems.find();
                    }
                });

            this.render('AddProblem');
        });


    
    Template.EditProblem.helpers({
            problemMapOptions: function() {
                // Make sure the maps API has loaded
                if (GoogleMaps.loaded()) {
                    // Map initialization options
                    return {
                        center: new google.maps.LatLng(this.lat,this.long),
                        zoom: 16,
                        mapTypeId:google.maps.MapTypeId.SATELLITE
                    };
                }
            }
        }); 

    
    
    Template.EditProblem.onCreated(function() {  
            GoogleMaps.ready('problemMap', function(map) {
                    google.maps.event.addListener(map.instance, 'click', function(event) {
                            console.log(this);
                            Problems.update({'_id': id}, 
                                { $set: {
                                    'lat': lat,
                                    'long': long,
                                    editedAt: new Date() // current time
                                }
                                });

//                            Markers.insert({ lat: event.latLng.lat(), lng: event.latLng.lng() });
                        });

                    // The code shown below goes here

                });
        });


    Router.route('/edit-problem/:_id', {
            name: "EditProblem",
            data : function () {
                return Problems.findOne({_id:this.params._id});
            },
            layoutTemplate:'EditProblem'
        });





    Template.EditProblem.events({
            "submit .edit-problem": function (event) {
                name = event.target.name.value;
                console.log(event);
                lat = event.target.lat.value;
                long = event.target.long.value;
                id = event.target._id.value;

                Problems.update({'_id': id}, 
                    {
                        'name': name,
                        'lat': lat,
                        'long': long,
                        editedAt: new Date() // current time
                    });

                return false;
            }
        });





    Template.AddProblem.events({
            "submit .add-problem": function (event) {
                var name = event.target.name.value;

                Problems.insert({
                        'name': name,
                        createdAt: new Date() // current time
                    });

                // Clear form
                event.target.name.value = "";

                // Prevent default form submit
                return false;
            }
        });

    Template.AddProblem.onCreated(function() {  
            console.log('hola');
            GoogleMaps.ready('ProblemMap', function(map) {
                    google.maps.event.addListener(map.instance, 'click', function(event) {
                            console.log(event.latLng.lat());
//                            Markers.insert({ lat: event.latLng.lat(), lng: event.latLng.lng() });
                        });

                    // The code shown below goes here

                });
        });


}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
