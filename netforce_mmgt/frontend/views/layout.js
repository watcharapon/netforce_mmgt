var LayoutView=Backbone.View.extend({
    template: Handlebars.templates.layout,
    events: {
    },

    initialize: function(options) {
        this.content=options.content;
        Backbone.View.prototype.initialize.call(this,options);
    },

    render: function(cb) {
        console.log("LayoutView.render");
        var that=this;
        var data={};
        var html=that.template(data);
        that.$el.html(html);
        that.$el.find(".content").append(that.content);
    },
});
