var TestView=Backbone.View.extend({
    template: Handlebars.templates.test,
    events: {
    },
    initialize: function(options) {
        Backbone.View.prototype.initialize.call(this,options);
    },

    render: function(cb) {
        var that=this;
        var args={};
        var data={
            'msg': "Hello Word",
        };
        var html=that.template(data);
        that.$el.html(html);
        if(cb) cb();
    },
});
