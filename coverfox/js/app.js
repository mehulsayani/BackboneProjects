(function(){
    var data = {
                'Andaman Nicobar': {
                    'Car Nicobar': [744301, 744302, 744303, 744304],
                    'Diglipur': [744108, 744109, 744110, 744267],
                    'Nancowrie': [744202, 744203, 744205, 744208]
                },
                'Andhra Pradesh': {
                    'Adilabad': [504309, 504310, 504312, 504313],
                    'Asifabad': [504273, 504274, 504275, 504276, 504277],
                    'Sitagondi': [504308, 504501, 504502, 504503]
                },
                'Karnataka': {
                    'Anekal': [562106, 562107, 562109, 562111, 562112],
                    'Bangalore': [562149, 560096, 560064, 560079]
                },
                'Maharashtra': {
                    'Akola': [444001, 444002, 444003, 444004, 444007, 444009],
                    'Amravati': [444602, 444603, 444604, 444609, 444614]
                }
            };

    window.APP = {Routers :{}, Collection :{}, Models : {}, Views :{}};

    window.APP.Routers.AppRouter = Backbone.Router.extend({
        routes: {
            'page/1' : 'first',
            'page/2' : 'second',
            'page/3' : 'third'
        },
        first: function(){
            new window.APP.Views.Page1View(data);
        },
        second: function(){
            new window.APP.Views.Page2View();
        },
        third: function(){
            new window.APP.Views.Page3View();
        }
    });
    window.APP.Models.Page1Model = Backbone.Model.extend({
        defaults : {
            //This is a default attribute for any model which have no photo prop defined
        }
    });
    window.APP.Models.Page2Model = Backbone.Model.extend({
        defaults : {
            'state': '',
            'city' : '',
            'pinCode': ''
        }
    });

    window.APP.Views.Page1View = Backbone.View.extend({
        initialize : function(data){
            this.model = new window.APP.Models.Page1Model(data);
            this.render();
        },
        el: '#main-container',
        template : $("#page1Template").html(),
        reUsableTemplate: $("#reUsableTemplate").html(),
        events: {
            "change #state-container": "populateCities",
            "change #city-container": "populatePinCode",
            "click #next-1": "showPage2"
        },
        render : function(){
            var self = this;
            self.$el.html(_.template(this.template));
            self.populateStates();

            return this;
        },
        populateStates : function(){
            var self = this;
            for(var key in self.model.toJSON()) {
                var tmpl = _.template(self.reUsableTemplate, {key: key});
                $('#state-container').append(tmpl);
            }
            if(localStorage.getItem('data')){
                self.prevData = JSON.parse(localStorage.getItem('data'));
                $('#state-container').val(self.prevData.state);
                self.populateCities();
            }
            return self;
        },
        populateCities:  function(event){
            $('#city-container, #pincode-container').empty().html('<option value="">Select an option</option>');
            var self = this;
            var stateObj= self.model.toJSON()[$('#state-container').val()];
            for(var key in stateObj) {
                var tmpl = _.template(self.reUsableTemplate, {key: key});
                $('#city-container').append(tmpl);
            }

            if(localStorage.getItem('data')){
                $('#city-container').val(self.prevData.city);
                self.populatePinCode();
            }

        },
        populatePinCode: function(event){
            var self = this;
            $('#pincode-container').empty().html('<option value="">Select an option</option>');
            var stateObj= self.model.toJSON()[$('#state-container').val()];
            var pinCodes = stateObj[$('#city-container').val()];
            _.each(pinCodes, function(pincode){
                var tmpl = _.template(self.reUsableTemplate, {key: pincode});
                $('#pincode-container').append(tmpl);
            });
            if(localStorage.getItem('data')){
                $('#pincode-container').val(self.prevData.pinCode);
            }
        },
        showPage2: function(){
            var obj = {
                state: $('#state-container').val(),
                city : $('#city-container').val(),
                pinCode: $('#pincode-container').val()
            };
            localStorage.setItem('data', JSON.stringify(obj));
            Backbone.history.navigate('page/2', {trigger:true});
        }

    });

    window.APP.Views.Page2View = Backbone.View.extend({
        initialize : function(){
            var data = JSON.parse(localStorage.getItem('data'));
            this.model = new window.APP.Models.Page2Model(data);
            this.render();
        },
        el: '#main-container',
        template : $("#page2Template").html(),
        events: {
            "click #next-2": "showPage3"
        },
        render : function(){
            var self = this;
            var model = self.model.toJSON();
            var pinCodeDigits = model.pinCode.split("");
            model.sum = 0;
            _.each(pinCodeDigits, function(digit){
                model.sum+= parseInt(digit);
            });
            self.$el.html(_.template(this.template, model));
            return this;
        },
        showPage3: function(){
            Backbone.history.navigate('page/3', {trigger:true});
        }

    });

    window.APP.Views.Page3View = Backbone.View.extend({
        initialize : function(){
//            this.model = new window.APP.Models.Page2Model(data);
            this.render();
        },
        el: '#main-container',
        template : $("#page3Template").html(),
        render : function(){
            var self = this;
            self.$el.html(_.template(this.template));
            return this;
        }

    });



}())

$(document).ready(function(){
    new window.APP.Routers.AppRouter();
    Backbone.history.start();
    Backbone.history.navigate('page/1', {trigger:true});
//    var directory = new window.APP.Views.DirectoryView();
})