!function(e,n){"object"==typeof exports&&"undefined"!=typeof module?module.exports=n():"function"==typeof define&&define.amd?define(n):e.badgee=n()}(this,function(){function e(e,n){return void 0!==e&&null!==e?n(e):void 0}var n=function(){},t=function(e){for(var n=[],t=arguments.length-1;t-- >0;)n[t]=arguments[t+1];for(var r in n){var l=n[r];for(var u in l)if(l.hasOwnProperty(u)){var o=l[u];e[u]=o}}return e},r=window.console||{},l=function(e){var t=[];for(var l in e){var o=e[l];r[o]?"function"!=typeof r[o]?u.push(o):t.push(o):(r[o]=n,t.push(o))}return t},u=["memory"],o=l(["debug","dirxml","error","group","groupCollapsed","info","log","warn"]),i=l(["assert","clear","count","dir","exception","groupEnd","markTimeline","profile","profileEnd","table","trace","time","timeEnd","timeStamp","timeline","timelineEnd"]),a={enabled:!0,styled:!0},c=t({},a),f=function(e){return"object"==typeof e&&(c=t({},a,e)),c},d=function(){this._store={}};d.prototype.add=function(e,n){this._store[e]=n},d.prototype.get=function(e){return this._store[e]||null},d.prototype.list=function(){return Object.keys(this._store)},d.prototype.each=function(e){var n=this;for(var t in n._store){e(t,n._store[t])}};var s=new d,p={"border-radius":"2px",padding:"1px 3px",margin:"0 1px",color:"white"},y={style:function(e,n){if(null!=e&&null!=n)n=t({},p,n),s.add(e,n);else if(null!=e)return s.get(e);return s.list()},defaults:function(e){return null!=e&&(p=e),p},stringForStyle:function(e){var n=s.get(e);return function(){var e=[];for(var t in n){var r=n[t],l=void 0;n.hasOwnProperty(t)&&(l=t+":"+r+";"),e.push(l)}return e}().join("")}},g={color:"black"};y.style("black",t({},{background:"black"})),y.style("blue",t({},{background:"blue"})),y.style("brown",t({},{background:"brown"})),y.style("gray",t({},{background:"gray"})),y.style("green",t({},{background:"green"})),y.style("purple",t({},{background:"purple"})),y.style("red",t({},{background:"red"})),y.style("cyan",t({},g,{background:"cyan"})),y.style("magenta",t({},g,{background:"magenta"})),y.style("orange",t({},g,{background:"orange"})),y.style("pink",t({},g,{background:"pink"})),y.style("yellow",t({},g,{background:"yellow"}));var b=f(),v=new d,h={include:null,exclude:null},k=function(e,n,t){return null==e&&(e=""),null==t&&(t=!1),e+(t?"%c":"[")+n+(t?"":"]")},m=function(e,n,t){var r=[];if(b.styled||(n=!1),t){var l=v.get(t);r=m(l.badgee.label,l.style,l.parent)}return e&&(r[0]=k(r[0],e,!!n)),n&&r.push(y.stringForStyle(n)),r},x=function(){var e=this;for(var t in o){e[o[t]]=n}for(var r in i){e[i[r]]=n}},w=function(e,n){var t=this;if(b.enabled){var l=m(this.label,e,n);e&&l.length>1&&(l[0]+="%c",l.push("p:a"));var a=null!=h.include&&!h.include.test(l[0]),c=null!=h.exclude?h.exclude.test(l[0]):void 0;if(a||c)x.bind(this)();else{for(var f in o){var d=o[f];t[d]=(y=r[d]).bind.apply(y,[r].concat(Array.from(l)))}for(var s in i){var p=i[s];t[p]=r[p].bind(r)}}return u.map(function(e){return t[e]=r[e]})}return x.bind(this)();var y},_=function(e,n,t){this.label=e,w.bind(this,n,t)(),v.add(this.label,{badgee:this,style:n,parent:t})};_.prototype.define=function(e,n){return new _(e,n,this.label)};var j=new _,E=function(){return v.each(function(e,n){return w.bind(n.badgee,n.style,n.parent)()})};j.style=y.style,j.defaultStyle=y.defaults,j.get=function(n){return e(v.get(n),function(e){return e.badgee})},j.filter={none:function(){return h={include:null,exclude:null},E(),j.filter},include:function(e){return null==e&&(e=null),e!==h.include&&(h.include=e,E()),j.filter},exclude:function(e){return null==e&&(e=null),e!==h.exclude&&(h.exclude=e,E()),j.filter}},j.config=function(e){return b=f(e),e&&E(),b};try{j.log()}catch(e){var S=r;S.define=function(){return r},S.style=j.style,S.styleDefaults=j.styleDefaults,S.filter=j.filter,S.get=function(){return r},S.config=function(){return j.config},j=S}return j});
//# sourceMappingURL=badgee.umd.js.map