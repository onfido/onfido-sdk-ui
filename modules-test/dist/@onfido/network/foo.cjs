exports.Network=function(o){var i=this;this.queue=[],this.options=void 0,this.dispatch=function(o){var t;((null==(t=i.options)?void 0:t.pipes)||[]).forEach(function(i){o=i(o)}),console.log("[Network] Sending data:",o)},this.options=o};
//# sourceMappingURL=foo.cjs.map
