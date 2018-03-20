(function (lib, img, cjs, ss) {

    var p; // shortcut to reference prototypes
    lib.webFontTxtFilters = {};

// library properties:
    lib.properties = {
        width: 970,
        height: 210,
        fps: 12,
        color: "#FFFFFF",
        opacity: 1.00,
        webfonts: {},
        manifest: [
            {src: "images/Leader DX 2 motor 0218_atlas_.png", id: "Leader DX 2 motor 0218_atlas_"}
        ]
    };


    lib.ssMetadata = [
        {
            name: "Leader DX 2 motor 0218_atlas_",
            frames: [[235, 0, 233, 208], [170, 210, 190, 143], [0, 210, 168, 165], [0, 0, 233, 208]]
        }
    ];


    lib.webfontAvailable = function (family) {
        lib.properties.webfonts[family] = true;
        var txtFilters = lib.webFontTxtFilters && lib.webFontTxtFilters[family] || [];
        for (var f = 0; f < txtFilters.length; ++f) {
            txtFilters[f].updateCache();
        }
    };
// symbols:


    (lib.chuchvalce2 = function () {
        this.spriteSheet = ss["Leader DX 2 motor 0218_atlas_"];
        this.gotoAndStop(0);
    }).prototype = p = new cjs.Sprite();


    (lib.DuoroX190 = function () {
        this.spriteSheet = ss["Leader DX 2 motor 0218_atlas_"];
        this.gotoAndStop(1);
    }).prototype = p = new cjs.Sprite();


    (lib.DuoroXmotor2 = function () {
        this.spriteSheet = ss["Leader DX 2 motor 0218_atlas_"];
        this.gotoAndStop(2);
    }).prototype = p = new cjs.Sprite();


    (lib.duoroXvybava2 = function () {
        this.spriteSheet = ss["Leader DX 2 motor 0218_atlas_"];
        this.gotoAndStop(3);
    }).prototype = p = new cjs.Sprite();


    (lib.vysusi = function (mode, startPosition, loop) {
        this.initialize(mode, startPosition, loop, {});

        // FlashAICB
        this.shape = new cjs.Shape();
        this.shape.graphics.f("#02BBA6").s().p("AAmBVIgmhMIgoAAIAABMIgSAAIAAipIA/AAQAXAAAOANQAOAMAAAXQAAASgLAMQgJAKgSADIApBOgAgogFIArAAQAQAAAJgIQAJgIAAgPQAAgQgJgIQgJgIgQAAIgrAAg");
        this.shape.setTransform(-193.1, 137.4, 0.95, 0.95);

        this.shape_1 = new cjs.Shape();
        this.shape_1.graphics.f("#02BBA6").s().p("AgqBFQgLgLgDgQQgCgLAAgfQAAgeACgKQADgQALgMQARgRAZAAQAaAAARARQALAMADAQQACAKAAAeQAAAfgCALQgDAQgLALQgRARgaAAQgZAAgRgRgAgcg5QgIAIgCAMQgCAKAAAbQAAAcACAKQACAMAIAIQALAMARAAQASAAALgMQAIgIACgMQACgLAAgbQAAgagCgLQgCgMgIgIQgMgMgRAAQgRAAgLAMg");
        this.shape_1.setTransform(-208.6, 137.4, 0.95, 0.95);

        this.shape_2 = new cjs.Shape();
        this.shape_2.graphics.f("#02BBA6").s().p("AgHBVIAAiZIgyAAIAAgQIBzAAIAAAQIgxAAIAACZg");
        this.shape_2.setTransform(-221.8, 137.4, 0.95, 0.95);

        this.shape_3 = new cjs.Shape();
        this.shape_3.graphics.f("#02BBA6").s().p("AgqBFQgLgLgDgQQgCgLAAgfQAAgeACgKQADgQALgMQARgRAZAAQAaAAARARQALAMADAQQACAKAAAeQAAAfgCALQgDAQgLALQgRARgaAAQgZAAgRgRgAgcg5QgIAIgCAMQgCAKAAAbQAAAcACAKQACAMAIAIQAMAMAQAAQASAAALgMQAIgIACgMQACgLAAgbQAAgagCgLQgCgMgIgIQgMgMgRAAQgQAAgMAMg");
        this.shape_3.setTransform(-235.1, 137.4, 0.95, 0.95);

        this.shape_4 = new cjs.Shape();
        this.shape_4.graphics.f("#02BBA6").s().p("AA2BVIAAiAIguBlIgOAAIgvhlIAACAIgTAAIAAipIATAAIA1B3IA2h3IATAAIAACpg");
        this.shape_4.setTransform(-251.8, 137.4, 0.95, 0.95);

        this.shape_5 = new cjs.Shape();
        this.shape_5.graphics.f("#02BBA6").s().p("AgHBwIAAhHIgzhiIAUAAIAmBQIAohQIATAAIgyBiIAABHgAgKhKIATglIAVAAIgaAlg");
        this.shape_5.setTransform(-272.7, 134.9, 0.95, 0.95);

        this.shape_6 = new cjs.Shape();
        this.shape_6.graphics.f("#02BBA6").s().p("AAtBVIhYiIIAACIIgTAAIAAipIASAAIBYCHIAAiHIATAAIAACpg");
        this.shape_6.setTransform(-286.9, 137.4, 0.95, 0.95);

        this.shape_7 = new cjs.Shape();
        this.shape_7.graphics.f("#02BBA6").s().p("AgzBVIAAipIASAAIAACZIBVAAIAAAQg");
        this.shape_7.setTransform(-301, 137.4, 0.95, 0.95);

        this.shape_8 = new cjs.Shape();
        this.shape_8.graphics.f("#02BBA6").s().p("AgIBVIAAipIAQAAIAACpg");
        this.shape_8.setTransform(-311.6, 137.4, 0.95, 0.95);

        this.shape_9 = new cjs.Shape();
        this.shape_9.graphics.f("#02BBA6").s().p("AggBRQgNgFgMgMIAMgNQALALAKAEQALAEANAAQATAAAKgIQALgJAAgPQAAgOgIgHQgHgGgQgCIgRgDQgUgDgMgIQgNgLAAgVQAAgWAPgNQAPgNAXAAQAeAAAVASIgMAMQgRgOgWAAQgQAAgJAIQgKAJAAAOQAAANAIAHQAIAHAPACIARADQAVAEAKAGQAOAMAAAWQAAAXgQANQgQAMgaAAQgSAAgOgFg");
        this.shape_9.setTransform(-321.7, 137.4, 0.95, 0.95);

        this.shape_10 = new cjs.Shape();
        this.shape_10.graphics.f("#FFFFFF").s().p("AAvBlIhbiNIAACNIgfAAIAAjJIAcAAIBcCMIAAiMIAeAAIAADJg");
        this.shape_10.setTransform(-346.9, 136.7, 0.807, 0.807);

        this.shape_11 = new cjs.Shape();
        this.shape_11.graphics.f("#FFFFFF").s().p("AgzBRQgOgOgDgUQgDgMAAgjQAAgiADgMQADgUAOgOQAWgVAdAAQAfAAAWAVQAOAOADAUQACALAAAjQAAAkgCALQgDAUgOAOQgVAVggAAQgeAAgVgVgAgdg9QgHAIgCAMQgCAMgBAdQABAeACAMQACAMAHAIQAMANARAAQASAAALgNQAIgIACgMQACgMAAgeQAAgdgCgMQgCgMgIgIQgLgNgSAAQgRAAgMANg");
        this.shape_11.setTransform(-363.2, 136.7, 0.807, 0.807);

        this.shape_12 = new cjs.Shape();
        this.shape_12.graphics.f("#FFFFFF").s().p("AAqBlIg3hkIgiAoIAAA8IgeAAIAAjJIAeAAIAABkIBRhkIAlAAIhBBQIBIB5g");
        this.shape_12.setTransform(-377.7, 136.7, 0.807, 0.807);

        this.shape_13 = new cjs.Shape();
        this.shape_13.graphics.f("#FFFFFF").s().p("AgOCFIAAhTIg8h1IAhAAIApBXIAqhXIAhAAIg8B1IAABTgAgNhXIATgtIAgAAIgfAtg");
        this.shape_13.setTransform(-393.1, 134.1, 0.807, 0.807);

        this.shape_14 = new cjs.Shape();
        this.shape_14.graphics.f("#FFFFFF").s().p("AgLBlIhCjJIAgAAIAtCRIAuiRIAgAAIhDDJg");
        this.shape_14.setTransform(-406.5, 136.7, 0.807, 0.807);

        this.shape_15 = new cjs.Shape();
        this.shape_15.graphics.f("#FFFFFF").s().p("AgbCFIAAjIIAdAAIAADIgAgXhXIAVgtIAeAAIgdAtg");
        this.shape_15.setTransform(-422.1, 134.1, 0.807, 0.807);

        this.shape_16 = new cjs.Shape();
        this.shape_16.graphics.f("#FFFFFF").s().p("AhHBsIAVgVQATAUAfAAQAUgBAKgHQALgJAAgPQAAgNgIgHQgGgHgQgCIgVgDQgYgEgPgMQgPgOAAgXQAAgbASgQQATgRAcAAQAmAAAZAYIgTATQgQgPgcgBQgQAAgKAKQgJAIAAAOQAAALAHAGQAKAHAOACIAUADQAaAEAMAMQAQAOAAAaQABAcgVAQQgUAQgfAAQgtAAgagagAgIhYIglgtIAYAAIAWAbIAZgbIAZAAIglAtg");
        this.shape_16.setTransform(-434.2, 134.1, 0.807, 0.807);

        this.shape_17 = new cjs.Shape();
        this.shape_17.graphics.f("#FFFFFF").s().p("AgnCAQgRgGgOgOIAUgVQATAUAfAAQATgBAMgHQALgJgBgPQABgMgJgIQgHgHgPgCIgWgDQgXgEgPgMQgPgOAAgXQAAgbASgQQATgRAdAAQAlAAAaAYIgUATQgQgPgcgBQgQAAgJAKQgKAIAAAOQAAALAIAGQAIAGAOADIAWADQAZAEAMAMQAQAOABAaQgBAcgUAQQgUAQgfAAQgXAAgQgGgAgJhYIgkgtIAYAAIAXAbIAZgbIAXAAIgkAtg");
        this.shape_17.setTransform(-448.4, 134.1, 0.807, 0.807);

        this.shape_18 = new cjs.Shape();
        this.shape_18.graphics.f("#FFFFFF").s().p("AgOBlIAAhUIg8h1IAhAAIApBZIAqhZIAhAAIg8B1IAABUg");
        this.shape_18.setTransform(-461.9, 136.7, 0.807, 0.807);

        this.shape_19 = new cjs.Shape();
        this.shape_19.graphics.f("#FFFFFF").s().p("AgLBlIhCjJIAgAAIAtCRIAuiRIAgAAIhDDJg");
        this.shape_19.setTransform(-475.2, 136.7, 0.807, 0.807);

        this.shape_20 = new cjs.Shape();
        this.shape_20.graphics.f("#FFFFFF").s().p("AAjBgIgjg6IgiA6Ig5AAIBChgIhAhfIA6AAIAfA3IAgg3IA5AAIg/BfIBCBgg");
        this.shape_20.setTransform(-497.3, 137.1, 0.807, 0.807);

        this.shape_21 = new cjs.Shape();
        this.shape_21.graphics.f("#FFFFFF").s().p("Ag4BzQgZgVgBgmIAwAAQABARAKAJQAKAIANAAQAQAAAJgKQAKgKAAgRQAAgQgJgKQgKgKgQAAIgHAAIAAgnIAHAAQAPAAAIgKQAIgIAAgPQAAgQgJgJQgJgIgNAAQgMAAgJAIQgJAIgBAPIgwAAQABgiAXgVQAWgUAhAAQAiAAAXAVQAWAVAAAiQAAAlgeAQQAiAQAAAqQAAAlgZAVQgXAUgjAAQghAAgXgSg");
        this.shape_21.setTransform(-514.1, 134.3, 0.807, 0.807);

        this.shape_22 = new cjs.Shape();
        this.shape_22.graphics.f("#02BBA6").s().p("AwFDWIAAmrMAgLAAAIAAGrg");
        this.shape_22.setTransform(-429.9, 135.7, 0.95, 0.95);

        this.shape_23 = new cjs.Shape();
        this.shape_23.graphics.f().s("#67B6A2").p("AcbDMMg41AALIAAmiMA41gALg");
        this.shape_23.setTransform(-354.8, 135.6, 0.95, 0.95);

        this.shape_24 = new cjs.Shape();
        this.shape_24.graphics.f("#FFFFFF").s().p("A8ZjLMA40gALIAAGiMg40AALg");
        this.shape_24.setTransform(-354.8, 135.6, 0.95, 0.95);

        this.timeline.addTween(cjs.Tween.get({}).to({state: [{t: this.shape_24}, {t: this.shape_23}, {t: this.shape_22}, {t: this.shape_21}, {t: this.shape_20}, {t: this.shape_19}, {t: this.shape_18}, {t: this.shape_17}, {t: this.shape_16}, {t: this.shape_15}, {t: this.shape_14}, {t: this.shape_13}, {t: this.shape_12}, {t: this.shape_11}, {t: this.shape_10}, {t: this.shape_9}, {t: this.shape_8}, {t: this.shape_7}, {t: this.shape_6}, {t: this.shape_5}, {t: this.shape_4}, {t: this.shape_3}, {t: this.shape_2}, {t: this.shape_1}, {t: this.shape}]}).wait(1));

    }).prototype = p = new cjs.MovieClip();
    p.nominalBounds = new cjs.Rectangle(-528.6, 114.2, 347.7, 42.9);


    (lib.vysajevytre = function (mode, startPosition, loop) {
        this.initialize(mode, startPosition, loop, {});

        // Vrstva 1
        this.shape = new cjs.Shape();
        this.shape.graphics.f("#02BBA6").s().p("AAuBHIAAhrIgoBVIgLAAIgohVIAABrIgPAAIAAiNIAPAAIAtBkIAuhkIAPAAIAACNg");
        this.shape.setTransform(315.2, 107.9);

        this.shape_1 = new cjs.Shape();
        this.shape_1.graphics.f("#02BBA6").s().p("AgrBHIAAiNIBXAAIAAAOIhIAAIAAAyIA9AAIAAAMIg9AAIAAA0IBIAAIAAANg");
        this.shape_1.setTransform(301.3, 107.9);

        this.shape_2 = new cjs.Shape();
        this.shape_2.graphics.f("#02BBA6").s().p("AgvBHIAAiNIAzAAQAKAAAIADQAIADAGAFQAGAGADAHQADAIAAAKQAAAJgDAIQgDAIgGAEQgGAFgIADQgIADgKAAIgkAAIAAA7gAggAAIAiAAQAHAAAGgBQAFgCAEgEQAEgDADgGQACgFAAgHQAAgHgCgFQgDgGgEgDQgEgEgFgCQgGgBgHAAIgiAAg");
        this.shape_2.setTransform(288.9, 107.9);

        this.shape_3 = new cjs.Shape();
        this.shape_3.graphics.f("#02BBA6").s().p("AgSBFQgKgEgHgHQgFgFgDgGIgEgMQgCgJAAgaIAAgSIACgQQABgHADgFQADgFAFgFQAHgIAKgEQAJgDAJAAQAKAAAJADQAKAEAHAIQAFAFADAFQACAFACAHIABAQIAAASQAAAagBAJIgEAMQgDAGgFAFQgHAHgKAEQgJADgKAAQgJAAgJgDgAgMg3QgHADgFAFIgEAHQgDAEgBAFQgCASAAANQABAYABAIQABAFADAEIAEAIQAFAEAHADQAGADAGAAQAGAAAHgDQAGgDAFgEIAFgIIAEgJQABgIABgYQAAgNgCgSIgEgJIgFgHQgFgFgGgDQgHgDgGAAQgGAAgGADg");
        this.shape_3.setTransform(275.3, 107.9);

        this.shape_4 = new cjs.Shape();
        this.shape_4.graphics.f("#02BBA6").s().p("AAuBHIAAhrIgoBVIgLAAIgohVIAABrIgPAAIAAiNIAPAAIAtBkIAuhkIAPAAIAACNg");
        this.shape_4.setTransform(260.4, 107.9);

        this.shape_5 = new cjs.Shape();
        this.shape_5.graphics.f("#02BBA6").s().p("AAuBHIAAhrIgoBVIgLAAIgohVIAABrIgPAAIAAiNIAPAAIAtBkIAuhkIAPAAIAACNg");
        this.shape_5.setTransform(238.7, 107.9);

        this.shape_6 = new cjs.Shape();
        this.shape_6.graphics.f("#02BBA6").s().p("AgGBdIAAg6IgrhTIARAAIAgBDIAhhDIARAAIgrBTIAAA6gAgIg+IAPgfIASAAIgWAfg");
        this.shape_6.setTransform(225.1, 105.7);

        this.shape_7 = new cjs.Shape();
        this.shape_7.graphics.f("#02BBA6").s().p("AAgBHIggg/IgiAAIAAA/IgPAAIAAiNIA1AAQAKAAAHADQAIACAGAFQAGAGADAHQACAIAAAJQAAAHgBAHQgDAGgEAFQgEAFgGACQgGADgGABIAiBBgAgigEIAlAAQAGAAAGgCQAEgBAFgDQADgEACgFQACgFABgGQgBgHgCgFIgFgIQgFgDgEgCQgGgBgGAAIglAAg");
        this.shape_7.setTransform(213.8, 107.9);

        this.shape_8 = new cjs.Shape();
        this.shape_8.graphics.f("#02BBA6").s().p("AAjBHIgphKIgfAiIAAAoIgPAAIAAiNIAPAAIAABQIBBhQIATAAIgtA3IAzBWg");
        this.shape_8.setTransform(200.9, 107.9);

        this.shape_9 = new cjs.Shape();
        this.shape_9.graphics.f("#02BBA6").s().p("AgSBFQgKgEgHgHQgFgFgDgGIgEgMQgCgJAAgaIAAgSIACgQQABgHADgFQADgFAFgFQAHgIAKgEQAJgDAJAAQAKAAAJADQAKAEAHAIQAFAFADAFQADAFABAHIACAQIAAASQAAAagCAJIgEAMQgDAGgFAFQgHAHgKAEQgJADgKAAQgJAAgJgDgAgMg3QgGADgGAFIgEAHQgDAEgBAFQgCASAAANQABAYABAIQABAFADAEIAEAIQAGAEAGADQAGADAGAAQAHAAAGgDQAGgDAFgEIAFgIIAEgJQABgIABgYQAAgNgCgSIgEgJIgFgHQgFgFgGgDQgGgDgHAAQgGAAgGADg");
        this.shape_9.setTransform(186.8, 107.9);

        this.shape_10 = new cjs.Shape();
        this.shape_10.graphics.f("#02BBA6").s().p("AAuBHIAAhrIgoBVIgLAAIgohVIAABrIgPAAIAAiNIAPAAIAtBkIAuhkIAPAAIAACNg");
        this.shape_10.setTransform(171.8, 107.9);

        this.shape_11 = new cjs.Shape();
        this.shape_11.graphics.f("#FFFFFF").s().p("AgsBHIAAiNIBaAAIAAATIhFAAIAAAqIA6AAIAAASIg6AAIAAArIBFAAIAAATg");
        this.shape_11.setTransform(145.6, 107.9);

        this.shape_12 = new cjs.Shape();
        this.shape_12.graphics.f("#FFFFFF").s().p("AAbBeIgdg8IgbAAIAAA8IgWAAIAAiNIA2AAQAKAAAIADQAJADAGAGQAFAFADAIQAEAIAAAJQAAAFgDAHQgCAGgEAFQgDAFgGADQgFADgGACIAhA/gAgdAPIAeAAQAGAAAEgBQAFgCADgDQADgCACgFQACgCAAgFQAAgFgCgEQgCgFgDgDQgDgDgFgBQgEgCgGAAIgeAAgAgMg9IgaggIARAAIASATIAPgTIARAAIgaAgg");
        this.shape_12.setTransform(132.8, 105.6);

        this.shape_13 = new cjs.Shape();
        this.shape_13.graphics.f("#FFFFFF").s().p("AgJBHIAAh6IgoAAIAAgTIBjAAIAAATIgnAAIAAB6g");
        this.shape_13.setTransform(119.8, 107.9);

        this.shape_14 = new cjs.Shape();
        this.shape_14.graphics.f("#FFFFFF").s().p("AgJBHIAAg7IgrhSIAYAAIAcA/IAeg/IAXAAIgrBSIAAA7g");
        this.shape_14.setTransform(108.5, 107.9);

        this.shape_15 = new cjs.Shape();
        this.shape_15.graphics.f("#FFFFFF").s().p("AgHBHIgviNIAWAAIAgBmIAghmIAXAAIgvCNg");
        this.shape_15.setTransform(97.1, 107.9);

        this.shape_16 = new cjs.Shape();
        this.shape_16.graphics.f("#FFFFFF").s().p("AAmBHIgKgdIg3AAIgKAdIgXAAIA1iNIAPAAIA1CNgAAVAYIgVg+IgVA+IAqAAg");
        this.shape_16.setTransform(79.8, 107.9);

        this.shape_17 = new cjs.Shape();
        this.shape_17.graphics.f("#FFFFFF").s().p("AgtBHIAAiNIBbAAIAAATIhEAAIAAAqIA5AAIAAASIg5AAIAAArIBEAAIAAATg");
        this.shape_17.setTransform(62.5, 107.9);

        this.shape_18 = new cjs.Shape();
        this.shape_18.graphics.f("#FFFFFF").s().p("AgYBFQgIgEgIgHIAPgOQAEAEAEACQAFACAHAAQAFAAAEgBQAFgCADgEQAEgDABgGQACgFAAgHIAAhfIAWAAIAABgQAAALgEAJQgDAJgHAGQgGAGgJADQgJADgIAAQgLAAgIgDg");
        this.shape_18.setTransform(50, 107.9);

        this.shape_19 = new cjs.Shape();
        this.shape_19.graphics.f("#FFFFFF").s().p("AAmBHIgKgdIg3AAIgKAdIgXAAIA0iNIAQAAIA1CNgAAWAYIgWg+IgVA+IArAAg");
        this.shape_19.setTransform(39.1, 107.9);

        this.shape_20 = new cjs.Shape();
        this.shape_20.graphics.f("#FFFFFF").s().p("AgOBHIgNgDIgMgGIgLgIIAPgPQAHAIAKADQAIADAKAAQAGAAAGgCQAFgBAEgDQAEgDACgEQACgEAAgFQAAgFgBgEQgCgDgDgDIgGgEIgJgCIgPgCQgJgCgHgDQgHgCgEgDQgGgFgCgHQgDgGAAgJQAAgKADgHQAEgIAGgGQAGgFAJgDQAJgDAJAAIANABIAMADQAFABAFAEIAKAHIgOAOQgHgGgIgDQgHgCgKAAQgEAAgFABQgFACgDADIgFAHQgCAEAAAFQAAAEACADQABAEADACQAFAFALACIAOACQAKACAGACQAGADAFACQAGAFADAIQADAHAAAJQAAAKgEAIQgEAIgHAFQgHAGgJADQgKACgKAAg");
        this.shape_20.setTransform(26.4, 107.9);

        this.shape_21 = new cjs.Shape();
        this.shape_21.graphics.f("#FFFFFF").s().p("AgJBHIAAg7IgrhSIAYAAIAcA/IAeg/IAXAAIgrBSIAAA7g");
        this.shape_21.setTransform(14.9, 107.9);

        this.shape_22 = new cjs.Shape();
        this.shape_22.graphics.f("#FFFFFF").s().p("AgHBHIgviNIAWAAIAgBmIAghmIAXAAIgvCNg");
        this.shape_22.setTransform(3.5, 107.9);

        this.shape_23 = new cjs.Shape();
        this.shape_23.graphics.f("#02BBA6").s().p("AsMCgIAAk/IYZAAIAAE/g");
        this.shape_23.setTransform(73.9, 107.4, 1.08, 1.08);

        this.shape_24 = new cjs.Shape();
        this.shape_24.graphics.f().s("#67B6A2").p("AYrCeMgxVAAAIAAk7MAxVAAAg");
        this.shape_24.setTransform(160.4, 107.9, 1.08, 1.08);

        this.shape_25 = new cjs.Shape();
        this.shape_25.graphics.f("#FFFFFF").s().p("A4qCeIAAk7MAxVAAAIAAE7g");
        this.shape_25.setTransform(160.4, 107.9, 1.08, 1.08);

        this.timeline.addTween(cjs.Tween.get({}).to({state: [{t: this.shape_25}, {t: this.shape_24}, {t: this.shape_23}, {t: this.shape_22}, {t: this.shape_21}, {t: this.shape_20}, {t: this.shape_19}, {t: this.shape_18}, {t: this.shape_17}, {t: this.shape_16}, {t: this.shape_15}, {t: this.shape_14}, {t: this.shape_13}, {t: this.shape_12}, {t: this.shape_11}, {t: this.shape_10}, {t: this.shape_9}, {t: this.shape_8}, {t: this.shape_7}, {t: this.shape_6}, {t: this.shape_5}, {t: this.shape_4}, {t: this.shape_3}, {t: this.shape_2}, {t: this.shape_1}, {t: this.shape}]}).wait(1));

    }).prototype = p = new cjs.MovieClip();
    p.nominalBounds = new cjs.Rectangle(-11.2, 89.7, 343.1, 36.3);


    (lib.spina = function (mode, startPosition, loop) {
        this.initialize(mode, startPosition, loop, {});

        // Vrstva 1
        this.shape = new cjs.Shape();
        this.shape.graphics.f("#FFFFFF").s().p("AgMBbIAAhLIg3hqIAeAAIAlBRIAmhRIAeAAIg3BqIAABLg");
        this.shape.setTransform(301, 103.3);

        this.shape_1 = new cjs.Shape();
        this.shape_1.graphics.f("#FFFFFF").s().p("AAqBbIhSh/IAAB/IgbAAIAAi1IAZAAIBSB+IAAh+IAcAAIAAC1g");
        this.shape_1.setTransform(283.6, 103.3);

        this.shape_2 = new cjs.Shape();
        this.shape_2.graphics.f("#FFFFFF").s().p("AgZB4IAAi0IAaAAIAAC0gAgVhOIAUgpIAaAAIgaApg");
        this.shape_2.setTransform(270.6, 100.3);

        this.shape_3 = new cjs.Shape();
        this.shape_3.graphics.f("#FFFFFF").s().p("Ag+BbIAAi1IBDAAQANAAALAFQALAEAHAHQAIAIAEAKQAEAKAAAMQAAAMgEAKQgEAKgIAFQgHAIgLAEQgLAEgNAAIgoAAIAABIgAgjgEIAmAAQAHAAAGgCQAGgCAFgEQAEgEACgFQACgGAAgHQAAgHgCgGQgCgGgEgEQgFgEgGgCQgGgCgHAAIgmAAg");
        this.shape_3.setTransform(257, 103.3);

        this.shape_4 = new cjs.Shape();
        this.shape_4.graphics.f("#FFFFFF").s().p("AgSB4QgJgBgIgEQgIgDgHgEQgHgFgHgGIATgTQAKALALAEQALADANAAQAIAAAHgCQAHgCAFgDQAFgEADgFQACgFAAgHQAAgGgCgFQgBgEgEgEQgDgDgFgBIgMgEIgTgCQgMgCgIgEQgJgEgGgFQgHgHgDgIQgDgJAAgJQAAgLAEgLQAEgJAIgIQAIgGALgEQAMgEAMgBIAQACQAIABAHACIANAHIAMAKIgSARQgIgIgKgEQgJgDgMAAQgGABgGACQgHACgEAEQgEADgCAGQgCAFAAAGQAAAFABAEQACADADADQAIAGANACIATADQAMADAIACQAIAEAGAFQAHAHAEAJQAEAJAAAMQAAANgFAKQgFAKgJAHQgJAGgMAFQgMADgNAAgAgHhOIghgqIAVAAIAVAZIAWgZIAWAAIghAqg");
        this.shape_4.setTransform(239.2, 100.4);

        this.shape_5 = new cjs.Shape();
        this.shape_5.graphics.f("#FFFFFF").s().p("AAiBbIglhNIgiAAIAABNIgcAAIAAi1IBFAAQANAAAKAEQALAEAHAHQAHAIAEAJQAEAKAAAMQAAAJgCAIQgDAIgFAHQgFAEgHAEQgGAEgIACIAqBRgAglgIIAnAAQAHAAAFgCQAGgBAEgEQAEgEACgFQADgFAAgHQAAgHgDgFQgCgFgEgEQgEgEgGgCQgFgCgHAAIgnAAg");
        this.shape_5.setTransform(215.7, 103.3);

        this.shape_6 = new cjs.Shape();
        this.shape_6.graphics.f("#FFFFFF").s().p("AgMBbIAAicIgyAAIAAgZIB+AAIAAAZIgzAAIAACcg");
        this.shape_6.setTransform(198.3, 103.3);

        this.shape_7 = new cjs.Shape();
        this.shape_7.graphics.f("#FFFFFF").s().p("AgMBbIAAi1IAZAAIAAC1g");
        this.shape_7.setTransform(186.1, 103.3);

        this.shape_8 = new cjs.Shape();
        this.shape_8.graphics.f("#FFFFFF").s().p("Ag4BbIAAi1IAbAAIAACcIBWAAIAAAZg");
        this.shape_8.setTransform(174.6, 103.3);

        this.shape_9 = new cjs.Shape();
        this.shape_9.graphics.f("#FFFFFF").s().p("AAFBbIAAiYIgiAfIAAgdIAigfIAZAAIAAC1g");
        this.shape_9.setTransform(150.3, 103.3);

        this.shape_10 = new cjs.Shape();
        this.shape_10.graphics.f("#FFFFFF").s().p("Ag5B4IAAgYIBSiDIhOAAIAAgZIBvAAIAAAWIhTCFIBTAAIAAAZgAgIhOIghgpIAVAAIAVAZIAWgZIAWAAIghApg");
        this.shape_10.setTransform(128.7, 100.3);

        this.shape_11 = new cjs.Shape();
        this.shape_11.graphics.f("#FFFFFF").s().p("AAwBbIgNglIhGAAIgMAlIgdAAIBCi1IAVAAIBCC1gAAcAfIgchPIgaBPIA2AAg");
        this.shape_11.setTransform(112.5, 103.3);

        this.shape_12 = new cjs.Shape();
        this.shape_12.graphics.f("#FFFFFF").s().p("AgYB4IAAi0IAZAAIAAC0gAgVhOIATgpIAcAAIgbApg");
        this.shape_12.setTransform(93.4, 100.3);

        this.shape_13 = new cjs.Shape();
        this.shape_13.graphics.f("#FFFFFF").s().p("Ag/BbIAAi1IA/AAQANAAAMAFQAMAEAJAJQAHAHAEAJQAEAHABAKIACAUIAAATQAAAZgCANQgBALgEAIQgEAKgHAHQgJAIgMAEQgMAFgNAAgAgkBCIAiAAQAIAAAHgDQAIgDAGgGQADgEACgGIADgNQACgJAAgWQAAgWgCgKIgDgLQgCgGgDgDQgGgHgIgDQgHgDgIAAIgiAAg");
        this.shape_13.setTransform(79.1, 103.3);

        this.shape_14 = new cjs.Shape();
        this.shape_14.graphics.f("#FFFFFF").s().p("AgMBbIAAi1IAZAAIAAC1g");
        this.shape_14.setTransform(65.2, 103.3);

        this.shape_15 = new cjs.Shape();
        this.shape_15.graphics.f("#FFFFFF").s().p("Ag4BbIAAi1IAbAAIAACcIBWAAIAAAZg");
        this.shape_15.setTransform(53.7, 103.3);

        this.shape_16 = new cjs.Shape();
        this.shape_16.graphics.f("#FFFFFF").s().p("AAmBbIgxhaIgfAlIAAA1IgcAAIAAi1IAcAAIAABaIBJhaIAhAAIg7BIIBBBtg");
        this.shape_16.setTransform(37, 103.3);

        this.shape_17 = new cjs.Shape();
        this.shape_17.graphics.f("#FFFFFF").s().p("AgZBXQgMgFgIgIQgJgJgFgLQgFgLAAgOIAAh4IAcAAIAAB2QAAAJACAHQADAIAFAFQAFAFAHADQAHACAHABQAIgBAHgCQAHgDAFgFQAFgFACgIQADgHAAgJIAAh2IAcAAIAAB4QAAAOgFALQgFALgJAJQgJAIgMAFQgMAFgNAAQgNAAgMgFg");
        this.shape_17.setTransform(17.7, 103.4);

        this.shape_18 = new cjs.Shape();
        this.shape_18.graphics.f("#02BBA6").s().p("A12CgIAAk/MArtAAAIAAE/g");
        this.shape_18.setTransform(160.8, 103.3, 1.22, 1.22);

        this.timeline.addTween(cjs.Tween.get({}).to({state: [{t: this.shape_18}, {t: this.shape_17}, {t: this.shape_16}, {t: this.shape_15}, {t: this.shape_14}, {t: this.shape_13}, {t: this.shape_12}, {t: this.shape_11}, {t: this.shape_10}, {t: this.shape_9}, {t: this.shape_8}, {t: this.shape_7}, {t: this.shape_6}, {t: this.shape_5}, {t: this.shape_4}, {t: this.shape_3}, {t: this.shape_2}, {t: this.shape_1}, {t: this.shape}]}).wait(1));

    }).prototype = p = new cjs.MovieClip();
    p.nominalBounds = new cjs.Rectangle(-10, 83.3, 341.5, 39.6);


    (lib.logo = function (mode, startPosition, loop) {
        this.initialize(mode, startPosition, loop, {});

        // Vrstva 1
        this.shape = new cjs.Shape();
        this.shape.graphics.f("#565656").s().p("AgSBZQgJgEgHgHQgFgFgDgFQgDgGgBgHQgCgIAAgaIABgUIABgMQABgHADgGQADgFAFgFQAHgHAJgEQAKgEAIABQAJAAAJACQAHADAHAGQAHAFAEAHQAEAJABAJIgOAAQgCgGgDgGQgDgEgFgFQgEgDgFgCQgGgCgGAAQgFAAgHACQgGADgFAEQgDAEgCAEIgDAJIgCAeIACAgIADAJQACAEADADQAFAFAGADQAHACAFAAQAGAAAGgCQAGgBAEgFQAEgDADgGQADgFACgGIAOAAQgBAJgEAJQgEAHgHAFQgHAGgHADQgJADgJAAQgIAAgKgEgAgGg9IgZgeIAOAAIARAUIARgUIANAAIgZAeg");
        this.shape.setTransform(-508.6, 48.8);

        this.shape_1 = new cjs.Shape();
        this.shape_1.graphics.f("#565656").s().p("AAqBGIgMggIg8AAIgLAgIgQAAIA0iLIALAAIAzCLgAAaAZIgahIIgZBIIAzAAg");
        this.shape_1.setTransform(-521.2, 51);

        this.shape_2 = new cjs.Shape();
        this.shape_2.graphics.f("#565656").s().p("AgEBGIgviLIAQAAIAjBwIAkhwIAQAAIgvCLg");
        this.shape_2.setTransform(-532.8, 51);

        this.shape_3 = new cjs.Shape();
        this.shape_3.graphics.f("#565656").s().p("AAqBGIgLggIg8AAIgMAgIgPAAIAziLIALAAIA0CLgAAaAZIgahIIgZBIIAzAAg");
        this.shape_3.setTransform(-544.4, 51);

        this.shape_4 = new cjs.Shape();
        this.shape_4.graphics.f("#565656").s().p("AgOBGIgMgDIgLgGIgKgJIAKgJIAJAHIAJAEQAIADALABQAHAAAHgCQAFgCAFgDQAEgEADgEQACgFAAgGQAAgGgCgEQgCgFgDgDIgHgFIgMgCIgOgCQgIgCgGgDQgHAAgFgEQgFgFgDgHQgDgGAAgIQAAgKADgGQAEgIAFgGQAHgEAIgEQAIgCAJAAQAJAAAOAEQAHACAMAKIgKAJQgHgGgHgDQgIgDgKAAQgGAAgFACQgGABgEAEQgEADgCAFQgBAFAAAGQgBAFACAFQACADADADIAIAFIALADIANACIAQAEQAFABAFAEQAGAEADAIQADAGAAAJQAAAJgEAIQgDAHgHAGQgGAFgJADQgJACgKAAIgOgBg");
        this.shape_4.setTransform(-556.5, 51);

        this.shape_5 = new cjs.Shape();
        this.shape_5.graphics.f("#565656").s().p("AgGBGIAAg6IgqhRIARAAIAfBEIAhhEIAQAAIgqBRIAAA6g");
        this.shape_5.setTransform(-567.5, 51);

        this.shape_6 = new cjs.Shape();
        this.shape_6.graphics.f("#565656").s().p("AgEBGIgviLIAQAAIAjBwIAkhwIAQAAIgvCLg");
        this.shape_6.setTransform(-578.2, 51);

        this.shape_7 = new cjs.Shape();
        this.shape_7.graphics.f("#565656").s().p("AgGBcIAAg6IgqhRIARAAIAfBCIAhhCIAQAAIgqBRIAAA6gAgIg8IAPgfIARAAIgVAfg");
        this.shape_7.setTransform(-594, 48.8);

        this.shape_8 = new cjs.Shape();
        this.shape_8.graphics.f("#565656").s().p("AAiBGIgphJIgdAiIAAAnIgPAAIAAiLIAPAAIAABPIA/hPIATAAIgtA2IAzBVg");
        this.shape_8.setTransform(-604.8, 51);

        this.shape_9 = new cjs.Shape();
        this.shape_9.graphics.f("#565656").s().p("AgSBEQgJgFgHgHQgFgFgDgFQgCgFgCgHQgCgIABgaIAAgSIABgPQACgHACgFQADgGAFgEQAHgIAJgDQAJgEAJAAQAKAAAHACQAJADAGAGQAHAFADAIQAFAIACAKIgQAAQgBgHgDgFQgDgFgEgEQgEgDgGgCQgGgCgGAAQgFAAgGACQgHADgEAEQgEADgCAFIgDAJIgBAeIABAgIADAJQACAEAEADQAEAEAHADQAGADAFAAQAGgBAGgCQAGgBAEgEQAEgEAEgFQACgGABgGIAQAAQgCAKgFAIQgDAHgHAGQgGAGgJADQgHACgKAAQgJAAgJgDg");
        this.shape_9.setTransform(-618.4, 51);

        this.shape_10 = new cjs.Shape();
        this.shape_10.graphics.f("#565656").s().p("AgGBGIAAiLIANAAIAACLg");
        this.shape_10.setTransform(-627.8, 51);

        this.shape_11 = new cjs.Shape();
        this.shape_11.graphics.f("#565656").s().p("AgGBGIAAh9IgpAAIAAgOIBfAAIAAAOIgpAAIAAB9g");
        this.shape_11.setTransform(-636.2, 51);

        this.shape_12 = new cjs.Shape();
        this.shape_12.graphics.f("#565656").s().p("AgSBEQgJgFgHgHQgFgFgDgFQgDgFgBgHQgCgIAAgaIABgSIABgPQABgHADgFQADgGAFgEQAHgIAJgDQAJgEAJAAQAKAAAJAEQAJADAIAIQAFAEACAGQADAFABAHIACAPIAAASQAAAagCAIQgBAHgDAFQgCAFgFAFQgIAHgJAFQgJADgKAAQgJAAgJgDgAgMg2QgGADgFAFIgFAHIgDAJIgCAeIACAfIADAKIAFAGQAFAGAGACQAHADAFAAQAGAAAHgDQAGgCAFgGIAFgGIADgKQACgHAAgYIgCgeIgDgJIgFgHQgFgFgGgDQgHgCgGAAQgFAAgHACg");
        this.shape_12.setTransform(-648.3, 51);

        this.shape_13 = new cjs.Shape();
        this.shape_13.graphics.f("#565656").s().p("AgvBGIAAiLIAzAAQAJAAAIADQAIACAFAFQAGAFADAHQADAHAAAIQAAAGgCAFQgBAFgDAEQgDAEgEADIgIAFIAJACQAFADADAFQADAEABAFQACAGAAAGQAAAJgDAIQgDAHgGAFQgFAFgIADQgIACgJAAgAggA4IAlAAQAGAAAFgCQAGgBADgDQAEgEACgEQACgGAAgFQAAgGgCgFQgCgFgEgDQgDgDgGgCQgFgCgGAAIglAAgAgggHIAjAAQAGABAFgCQAFgCAEgCQAEgDACgFQACgFAAgGQAAgGgCgFQgCgFgEgDQgEgCgFgCQgFgCgGABIgjAAg");
        this.shape_13.setTransform(-661.2, 51);

        this.shape_14 = new cjs.Shape();
        this.shape_14.graphics.f("#565656").s().p("AgSBEQgJgFgHgHQgFgFgDgFQgDgFgBgHQgCgIAAgaIABgSIABgPQABgHADgFQADgGAFgEQAHgIAJgDQAJgEAJAAQAKAAAJAEQAJADAIAIQAFAEACAGQADAFABAHIACAPIAAASQAAAagCAIQgBAHgDAFQgCAFgFAFQgIAHgJAFQgJADgKAAQgJAAgJgDgAgMg2QgGADgFAFIgFAHIgDAJIgCAeIACAfIADAKIAFAGQAFAGAGACQAHADAFAAQAGAAAHgDQAGgCAFgGIAFgGIADgKQACgHAAgYIgCgeIgDgJIgFgHQgFgFgGgDQgHgCgGAAQgFAAgHACg");
        this.shape_14.setTransform(-674.7, 51);

        this.shape_15 = new cjs.Shape();
        this.shape_15.graphics.f("#565656").s().p("AAfBGIgfg/IghAAIAAA/IgPAAIAAiLIA0AAQAJAAAIADQAIACAFAFQAGAGADAHQADAHAAAJQAAAIgCAGQgCAHgFAEQgEAFgFABQgGAEgHABIAiBAgAghgEIAkAAQAGAAAFgCQAFgBAEgDQAEgDACgFQACgFAAgGQAAgHgCgFQgCgEgEgEIgJgFQgFgCgGABIgkAAg");
        this.shape_15.setTransform(-687.3, 51);

        this.shape_16 = new cjs.Shape();
        this.shape_16.graphics.f("#565656").s().p("AgGBcIAAg6IgqhRIARAAIAfBCIAhhCIAQAAIgqBRIAAA6gAgIg8IAPgfIARAAIgVAfg");
        this.shape_16.setTransform(-704.6, 48.8);

        this.shape_17 = new cjs.Shape();
        this.shape_17.graphics.f("#565656").s().p("AAlBGIhJhvIAABvIgPAAIAAiLIAOAAIBJBvIAAhvIAPAAIAACLg");
        this.shape_17.setTransform(-717.1, 51);

        this.shape_18 = new cjs.Shape();
        this.shape_18.graphics.f("#565656").s().p("AAmBGIhKhvIAABvIgOAAIAAiLIANAAIBKBvIAAhvIAOAAIAACLg");
        this.shape_18.setTransform(-731.7, 51);

        this.shape_19 = new cjs.Shape();
        this.shape_19.graphics.f("#565656").s().p("AgSBEQgJgFgHgHQgFgFgDgFQgDgFgBgHQgCgIAAgaIABgSIABgPQABgHADgFQADgGAFgEQAHgIAJgDQAJgEAJAAQAKAAAJAEQAJADAIAIQAFAEACAGQADAFABAHIACAPIAAASQAAAagCAIQgBAHgDAFQgCAFgFAFQgIAHgJAFQgJADgKAAQgJAAgJgDgAgMg2QgGADgFAFIgFAHIgDAJIgCAeIACAfIADAKIAFAGQAFAGAGACQAHADAFAAQAGAAAHgDQAGgCAFgGIAFgGIADgKQACgHAAgYIgCgeIgDgJIgFgHQgFgFgGgDQgHgCgGAAQgFAAgHACg");
        this.shape_19.setTransform(-745.6, 51);

        this.shape_20 = new cjs.Shape();
        this.shape_20.graphics.f("#565656").s().p("AAiBGIgphJIgdAiIAAAnIgPAAIAAiLIAPAAIAABPIA/hPIATAAIgtA2IAzBVg");
        this.shape_20.setTransform(-757.8, 51);

        this.shape_21 = new cjs.Shape();
        this.shape_21.graphics.f("#565656").s().p("AgGBcIAAg6IgqhRIARAAIAfBCIAhhCIAQAAIgqBRIAAA6gAgIg8IAPgfIARAAIgVAfg");
        this.shape_21.setTransform(-770.4, 48.8);

        this.shape_22 = new cjs.Shape();
        this.shape_22.graphics.f("#565656").s().p("AgFBGIguiLIAQAAIAjBwIAkhwIAQAAIgvCLg");
        this.shape_22.setTransform(-781, 51);

        this.shape_23 = new cjs.Shape();
        this.shape_23.graphics.f("#565656").s().p("AgvAvQgUgUAAgbQAAgaAUgUQAUgTAbAAIAAAAQAcAAAVATQATATAAAbQAAAbgUAUQgUATgcAAQgbAAgUgTgAgkgkQgOAPAAAVQAAAWAPAPQAOAQAVAAQAVAAAPgPQAPgQAAgWQAAgVgPgPQgPgQgVAAIAAAAQgVAAgPAQgAAPAiQgCgCgDgOQgCgLgKAAIgHAAIAAAbIgQAAIAAhBQAMgCANAAQAPAAAHAGQAHAEAAAKQAAALgOADIAAABQAIACADAOIAGAQgAgJgUIAAATIAHAAQAOAAAAgKQAAgKgMAAIgJABg");
        this.shape_23.setTransform(-489.7, -9.3, 0.9, 0.9);

        this.shape_24 = new cjs.Shape();
        this.shape_24.graphics.f("#565656").s().p("AhwDAQg1AAgdgWQgfgVAAgmIAAgMIAxiuQAfh0CWAAIBwAAQBsAAAABMIAAALIgEAQIgMAyIlFBsIgBAGQgDAJAAAHQAAATAiAAIEEAAIgXBRgAhMhKIgQA3IDVhHQgBgKgFgFQgFgFgRAAIh4AAQgpAAgIAkg");
        this.shape_24.setTransform(-518.1, 13.5, 0.9, 0.9);

        this.shape_25 = new cjs.Shape();
        this.shape_25.graphics.f("#565656").s().p("AA5DAIBKkQQABgDAAgGQABgTghAAIh1AAQgoAAgIAcIhJEQIhkAAIBLkXQAdhoCJAAIB3AAQB1AAAABLQAAANgEAQIhMEXg");
        this.shape_25.setTransform(-558.4, 13.5, 0.9, 0.9);

        this.shape_26 = new cjs.Shape();
        this.shape_26.graphics.f("#565656").s().p("AllEAQglAAgSgPQgTgPAAgZQAAghAhgbIFbkwIkVAAIAZhcIFJAAQAfAAATAQQASAQAAAYQAAAQgHAOQgJAPgSAMIlaEyIIIAAQAoAAAKgkIAmiMIACgKQAAgXghAAIh5AAQgqAAgIAiIgdBrIg4AjIgrgpIAgh5QALgvAngYQAngYBFAAICLAAQA0AAAdATQAeAUAAAjQAAAKgDALIgzC8QgMAqgrAdQgrAcg/AAg");
        this.shape_26.setTransform(-615.6, 7.7, 0.9, 0.9);

        this.shape_27 = new cjs.Shape();
        this.shape_27.graphics.f("#565656").s().p("Ah/EAQgnAAgdgWQgfgZAAgpIAAgPIBvmYIBlAAIghB8ICgAAQByAAAABKQAAAKgFATIgxCxQgOAxgrAdQgsAdg2AAgAhOgUIgrCgIAAAJQAAAZAdAAICBAAQAdAAAIgdIArikIADgLQgBgTgfAAIh5AAQglAAgIAdg");
        this.shape_27.setTransform(-675.7, 7.7, 0.9, 0.9);

        this.shape_28 = new cjs.Shape();
        this.shape_28.graphics.f("#565656").s().p("Ah4DAQg0AAgdgWQgdgVAAgjQAAgNADgJIAzi8QAMgvAngYQAngYBFAAICIAAQA1AAAeAUQAdATAAAjQAAAKgCALIg0C8QgNArgqAcQgrAdg/AAgAhQhMIgoCUIgCAOQAAAZAgAAIB3AAQApAAAKgkIAqiXIACgLQgBgXghAAIh3AAQgqAAgJAig");
        this.shape_28.setTransform(-716.7, 13.5, 0.9, 0.9);

        this.shape_29 = new cjs.Shape();
        this.shape_29.graphics.f("#565656").s().p("AA5EAIiijWQgEgGAAgKQAAgZAWgTQAbgaAtAAIB+AAQAUAAANgJQAOgIAEgNIAPg2IACgLQAAgYghAAIjYAAIhyGjIhvAAICLn/IFVAAQA3AAAeAbQAaAXAAAlIgBAOIgaBgQgLApgxAeQgxAhgtAAIhKAAIChDSg");
        this.shape_29.setTransform(-759.6, 7.7, 0.9, 0.9);

        this.timeline.addTween(cjs.Tween.get({}).to({state: [{t: this.shape_29}, {t: this.shape_28}, {t: this.shape_27}, {t: this.shape_26}, {t: this.shape_25}, {t: this.shape_24}, {t: this.shape_23}, {t: this.shape_22}, {t: this.shape_21}, {t: this.shape_20}, {t: this.shape_19}, {t: this.shape_18}, {t: this.shape_17}, {t: this.shape_16}, {t: this.shape_15}, {t: this.shape_14}, {t: this.shape_13}, {t: this.shape_12}, {t: this.shape_11}, {t: this.shape_10}, {t: this.shape_9}, {t: this.shape_8}, {t: this.shape_7}, {t: this.shape_6}, {t: this.shape_5}, {t: this.shape_4}, {t: this.shape_3}, {t: this.shape_2}, {t: this.shape_1}, {t: this.shape}]}).wait(1));

    }).prototype = p = new cjs.MovieClip();
    p.nominalBounds = new cjs.Rectangle(-788.2, -15.4, 304.7, 79.9);


    (lib.kufriktxt = function (mode, startPosition, loop) {
        this.initialize(mode, startPosition, loop, {});

        // Vrstva 1
        this.shape = new cjs.Shape();
        this.shape.graphics.f("#FFFFFF").s().p("AgXA6QgIgDgFgEQgGgHgEgJQgCgIAAgLIAAhNIAZAAIAABJQAAAHABAGQACAFAEADQADADAFACQAEABAEAAQAFAAAEgBIAIgFQADgDACgFQACgGAAgHIAAhJIAZAAIAAB5IgYAAIAAgNQgGAIgJADQgIADgHABQgKAAgIgEg");
        this.shape.setTransform(300.8, 127.3);

        this.shape_1 = new cjs.Shape();
        this.shape_1.graphics.f("#FFFFFF").s().p("AgUA6QgIgEgHgGQgEgFgDgFIgFgLQgCgLgBgQQABgPACgLIAFgLQADgFAEgFQAHgGAIgEQAJgEALAAQALAAAKAEQAIAEAHAGIAHAKQADAFACAGQACALAAAPQAAAQgCALQgCAGgDAFIgHAKQgHAGgIAEQgKAEgLAAQgLAAgJgEgAgIglQgFABgDAEQgGAFgBAJQgCAHAAALQAAALACAHQABAKAGAFQADADAFACQAEACAEAAQAFAAAFgCQAEgCAEgDQAEgFACgKQACgHAAgLQAAgLgCgHQgCgJgEgFQgEgEgEgBQgFgCgFAAQgEAAgEACg");
        this.shape_1.setTransform(286.8, 127.2);

        this.shape_2 = new cjs.Shape();
        this.shape_2.graphics.f("#FFFFFF").s().p("AgJA9Igth5IAaAAIAcBVIAchVIAbAAIgtB5g");
        this.shape_2.setTransform(274, 127.2);

        this.shape_3 = new cjs.Shape();
        this.shape_3.graphics.f("#FFFFFF").s().p("AgZA7QgIgCgFgGQgFgFgDgHQgCgGAAgIQAAgIACgGQAEgHAEgEQAGgDAHgDQAJgCAKAAIAeAAIAAgJQABgGgCgEQgBgFgEgCQgDgDgFgCQgFgBgGAAQgJAAgHADQgFACgFAHIgRgPIAJgJQAFgDAFgCQAKgEAPAAQALAAAKADQAJACAGAFQAHAGADAIQADAHAAALIAABQIgYAAIAAgLQgHAHgHACQgIADgIAAQgMAAgIgDgAgTALQgFAFAAAIQAAAJAFAEQAGAFALAAQAHAAAEgCQAFgBAFgEQADgDABgFQACgEgBgGIAAgKIgaAAQgLAAgGAEg");
        this.shape_3.setTransform(260.9, 127.2);

        this.shape_4 = new cjs.Shape();
        this.shape_4.graphics.f("#FFFFFF").s().p("AgKBTQgIgDgHgIIAAANIgYAAIAAiqIAZAAIAAA+QAGgIAIgDQAIgDAIAAQAJAAAIADQAIADAFAFQAEAEADAGQADAGABAHQADAJAAARQAAASgDALQgBAHgDAGQgDAGgEAEQgFAGgIACQgIADgJAAQgJAAgHgDgAgMgMQgFADgDAGQgCADgBAIIgBAPQABAWADAHQADAGAFADQAGADAGAAQAIAAAFgDQAFgDADgGQADgHABgWIgBgPQgBgIgCgDQgDgGgFgDQgFgDgIAAQgGAAgGADg");
        this.shape_4.setTransform(247.8, 124.8);

        this.shape_5 = new cjs.Shape();
        this.shape_5.graphics.f("#FFFFFF").s().p("AgqB0IAAgWIAHAAQAIAAADgDQAEgDACgHIAHgUIgqhyIAaAAIAbBUIAchUIAaAAIg2CRQgBAJgGAGQgEAFgHACQgGACgIAAgAgLhLIAQgoIAcAAIgbAog");
        this.shape_5.setTransform(234.6, 126.5);

        this.shape_6 = new cjs.Shape();
        this.shape_6.graphics.f("#FFFFFF").s().p("AgIA9Igth5IAaAAIAbBVIAchVIAbAAIgtB5g");
        this.shape_6.setTransform(222.6, 127.2);

        this.shape_7 = new cjs.Shape();
        this.shape_7.graphics.f("#FFFFFF").s().p("AgaA7QgHgCgFgEQgHgDgEgFIAPgRQAIAHAJAEQAIACAJAAQAMAAAGgEQAJgEgBgJQAAgGgDgEQgFgDgIgBIgSgCQgIgBgHgCQgGgCgGgDQgEgEgDgGQgCgGAAgIQABgIADgIQADgGAHgFQAGgFAIgDQAJgCAHAAQAPAAALADQAMADAIAIIgPAPQgGgEgJgDQgHgCgJAAQgIAAgHAFQgFAEAAAHQAAAGADADQAFAEAJABIARACIAQADQAGACAFAEQAFADACAGQACAGABAIQAAAKgFAHQgDAHgHAFQgHAFgJADQgKACgKAAQgPAAgLgDg");
        this.shape_7.setTransform(203.6, 127.2);

        this.shape_8 = new cjs.Shape();
        this.shape_8.graphics.f("#FFFFFF").s().p("AAkBVIgvhUIgcAjIAAAxIgbAAIAAiqIAbAAIAABVIBEhVIAfAAIg3BEIA9Bmg");
        this.shape_8.setTransform(183.7, 124.7);

        this.shape_9 = new cjs.Shape();
        this.shape_9.graphics.f("#FFFFFF").s().p("AgXBxIAAiqIAYAAIAACqgAgUhJIASgnIAaAAIgZAng");
        this.shape_9.setTransform(171.6, 121.9);

        this.shape_10 = new cjs.Shape();
        this.shape_10.graphics.f("#FFFFFF").s().p("AAgBxIgjhIIggAAIAABIIgaAAIAAiqIBBAAQAMAAAJAEQALAEAGAGQAIAHADAJQAEAKAAALQAAAHgCAHQgDAIgFAGQgEAFgHAEQgGAEgIACIAoBMgAgjATIAlAAQAGAAAFgCQAGgCAEgEQAEgDACgFQACgDAAgGQAAgGgCgGQgCgFgEgDQgEgEgGgBQgFgCgGAAIglAAgAgPhJIgfgnIAVAAIAVAXIASgXIAVAAIgfAng");
        this.shape_10.setTransform(158.9, 121.9);

        this.shape_11 = new cjs.Shape();
        this.shape_11.graphics.f("#FFFFFF").s().p("Ag2BVIAAiqIBsAAIAAAYIhSAAIAAA0IBGAAIAAAWIhGAAIAABIg");
        this.shape_11.setTransform(143.4, 124.7);

        this.shape_12 = new cjs.Shape();
        this.shape_12.graphics.f("#FFFFFF").s().p("AgXBSQgMgEgHgIQgJgIgFgLQgEgLAAgNIAAhwIAaAAIAABvQAAAIADAHQACAHAFAFQAEAFAHACQAGADAHAAQAHAAAHgDQAGgCAFgFQAFgFACgHQADgHAAgIIAAhvIAaAAIAABwQAAANgEALQgFALgJAIQgIAIgLAEQgMAEgMAAQgMAAgLgEg");
        this.shape_12.setTransform(126.9, 124.8);

        this.shape_13 = new cjs.Shape();
        this.shape_13.graphics.f("#FFFFFF").s().p("AAkBVIguhUIgeAjIAAAxIgaAAIAAiqIAaAAIAABVIBFhVIAgAAIg4BEIA9Bmg");
        this.shape_13.setTransform(111.1, 124.7);

        this.shape_14 = new cjs.Shape();
        this.shape_14.graphics.f("#FFFFFF").s().p("AgLBVIAAiqIAYAAIAACqg");
        this.shape_14.setTransform(91.5, 124.7);

        this.shape_15 = new cjs.Shape();
        this.shape_15.graphics.f("#FFFFFF").s().p("Ag1BVIAAiqIBsAAIAAAYIhSAAIAAA0IBFAAIAAAWIhFAAIAABIg");
        this.shape_15.setTransform(80.9, 124.7);

        this.shape_16 = new cjs.Shape();
        this.shape_16.graphics.f("#FFFFFF").s().p("AgXBSQgLgEgKgKQgGgGgEgGIgEgQQgCgLgBgdIABgVQAAgLACgHQACgJACgGQAEgIAGgFQAKgKALgEQALgFAMAAQANAAALAFQAMAEAJAKQAGAFADAIQAEAGACAJQABAHAAALIAAAVQAAAdgBALQgCAIgEAIQgDAGgGAGQgJAKgMAEQgLAFgNAAQgMAAgLgFgAgNg7QgGACgFAFQgGAHgCALQgDAJAAAZQAAAZADALQACAKAGAHQAFAFAGACQAHAEAGAAQAHAAAHgEQAGgCAFgFQAGgHACgKQACgLAAgZQAAgZgCgJQgCgLgGgHQgFgFgGgCQgHgDgHgBQgGABgHADg");
        this.shape_16.setTransform(64.7, 124.7);

        this.shape_17 = new cjs.Shape();
        this.shape_17.graphics.f("#FFFFFF").s().p("AAgBVIgjhIIggAAIAABIIgaAAIAAiqIBAAAQAMABALADQAJAEAIAHQAGAHAEAIQAEAKAAALQAAAJgCAHQgDAIgFAGQgFAEgGADQgGAFgIACIAoBLgAgjgHIAkAAQAHAAAFgCQAGgBAEgEQAEgDACgFQACgFAAgHQAAgGgCgGQgCgFgEgDQgEgEgGgBQgFgCgHAAIgkAAg");
        this.shape_17.setTransform(48.9, 124.7);

        this.shape_18 = new cjs.Shape();
        this.shape_18.graphics.f("#FFFFFF").s().p("Ag7BVIAAiqIA/AAQANABAKADQALAEAHAIQAHAGAEAKQAEAKAAALQAAALgEAJQgEAKgHAFQgHAHgLAEQgKAEgNAAIglAAIAABDgAghgEIAkAAQAHAAAGgBQAFgCAEgEQAFgEABgFQADgGAAgGQAAgHgDgGQgBgEgFgFQgEgDgFgCQgGgCgHAAIgkAAg");
        this.shape_18.setTransform(32.8, 124.7);

        this.shape_19 = new cjs.Shape();
        this.shape_19.graphics.f("#FFFFFF").s().p("AgNA1IAAgnIgnAAIAAgbIAnAAIAAgnIAbAAIAAAnIAnAAIAAAbIgnAAIAAAng");
        this.shape_19.setTransform(12.3, 125, 1.15, 1.15);

        this.shape_20 = new cjs.Shape();
        this.shape_20.graphics.f("#02BBA6").s().p("A3FCgIAAk/MAuKAAAIAAE/g");
        this.shape_20.setTransform(160, 124.2, 1.15, 1.15);

        this.timeline.addTween(cjs.Tween.get({}).to({state: [{t: this.shape_20}, {t: this.shape_19}, {t: this.shape_18}, {t: this.shape_17}, {t: this.shape_16}, {t: this.shape_15}, {t: this.shape_14}, {t: this.shape_13}, {t: this.shape_12}, {t: this.shape_11}, {t: this.shape_10}, {t: this.shape_9}, {t: this.shape_8}, {t: this.shape_7}, {t: this.shape_6}, {t: this.shape_5}, {t: this.shape_4}, {t: this.shape_3}, {t: this.shape_2}, {t: this.shape_1}, {t: this.shape}]}).wait(1));

    }).prototype = p = new cjs.MovieClip();
    p.nominalBounds = new cjs.Rectangle(-10, 105.8, 339.9, 36.8);


    (lib.ClipGroup = function (mode, startPosition, loop) {
        this.initialize(mode, startPosition, loop, {});

        // FlashAICB
        this.shape = new cjs.Shape();
        this.shape.graphics.f().s("#FFFFFF").ss(1.2).p("AYJIcMgwRgQ3");
        this.shape.setTransform(220, 481.7);

        this.shape_1 = new cjs.Shape();
        this.shape_1.graphics.f().s("#FFFFFF").ss(1.2).p("EA1DAQVMhqEggp");
        this.shape_1.setTransform(401, 447.2);

        this.shape_2 = new cjs.Shape();
        this.shape_2.graphics.f().s("#FFFFFF").ss(1.2).p("EBJQAVVMiSfgqp");
        this.shape_2.setTransform(535.6, 413.2);

        this.shape_3 = new cjs.Shape();
        this.shape_3.graphics.f().s("#FFFFFF").ss(1.2).p("EBPJAUUMieQgon");
        this.shape_3.setTransform(584, 360.7);

        this.shape_4 = new cjs.Shape();
        this.shape_4.graphics.f().s("#FFFFFF").ss(1.2).p("EBOIAScMicOgk2");
        this.shape_4.setTransform(597.5, 296.7);

        this.shape_5 = new cjs.Shape();
        this.shape_5.graphics.f().s("#FFFFFF").ss(1.2).p("EBBeANrMiC6gbU");
        this.shape_5.setTransform(687.5, 259.2);

        this.shape_6 = new cjs.Shape();
        this.shape_6.graphics.f().s("#FFFFFF").ss(1.2).p("EAx7AJiMhj0gTC");
        this.shape_6.setTransform(799, 232.7);

        this.shape_7 = new cjs.Shape();
        this.shape_7.graphics.f().s("#FFFFFF").ss(1.2).p("EAmhAGfMhNBgM9");
        this.shape_7.setTransform(882, 204.2);

        this.shape_8 = new cjs.Shape();
        this.shape_8.graphics.f().s("#FFFFFF").ss(1.2).p("ALOnGI2bON");
        this.shape_8.setTransform(120.3, 216.2);

        this.shape_9 = new cjs.Shape();
        this.shape_9.graphics.f().s("#FFFFFF").ss(1.2).p("AQxq6MghhAV2");
        this.shape_9.setTransform(172.8, 236.7);

        this.shape_10 = new cjs.Shape();
        this.shape_10.graphics.f().s("#FFFFFF").ss(1.2).p("AY5vnMgxxAfO");
        this.shape_10.setTransform(214.8, 265.7);

        this.shape_11 = new cjs.Shape();
        this.shape_11.graphics.f().s("#FFFFFF").ss(1.2).p("Ack1jMg5HArH");
        this.shape_11.setTransform(265.3, 299.7);

        this.shape_12 = new cjs.Shape();
        this.shape_12.graphics.f().s("#FFFFFF").ss(1.2).p("EAiggajMhE/A1H");
        this.shape_12.setTransform(300.3, 344.7);

        this.shape_13 = new cjs.Shape();
        this.shape_13.graphics.f().s("#FFFFFF").ss(1.2).p("Adg68Mg6/A15");
        this.shape_13.setTransform(394.3, 345.2);

        this.shape_14 = new cjs.Shape();
        this.shape_14.graphics.f().s("#FFFFFF").ss(1.2).p("AZ96tMgz5A1a");
        this.shape_14.setTransform(485.6, 343.7);

        this.shape_15 = new cjs.Shape();
        this.shape_15.graphics.f().s("#FFFFFF").ss(1.2).p("AXw6tMgveA1b");
        this.shape_15.setTransform(584.5, 345.7);

        this.shape_16 = new cjs.Shape();
        this.shape_16.graphics.f().s("#FFFFFF").ss(1.2).p("AVL7BMgqUA2D");
        this.shape_16.setTransform(664, 348.7);

        this.shape_17 = new cjs.Shape();
        this.shape_17.graphics.f().s("#FFFFFF").ss(1.2).p("ARl7GMgjJA2N");
        this.shape_17.setTransform(753, 345.2);

        this.shape_18 = new cjs.Shape();
        this.shape_18.graphics.f().s("#FFFFFF").ss(1.2).p("AQG8CMggLA4F");
        this.shape_18.setTransform(833.5, 349.2);

        this.shape_19 = new cjs.Shape();
        this.shape_19.graphics.f().s("#FFFFFF").ss(1.2).p("AM07uMgZnA3d");
        this.shape_19.setTransform(931.5, 346.2);

        this.shape_20 = new cjs.Shape();
        this.shape_20.graphics.f().s("#FFFFFF").ss(1.2).p("AK38MMgVtA4Z");
        this.shape_20.setTransform(1021, 354.2);

        this.shape_21 = new cjs.Shape();
        this.shape_21.graphics.f().s("#CFD1D2").p("AYJIcMgwRgQ3");
        this.shape_21.setTransform(221.1, 482.3);

        this.shape_22 = new cjs.Shape();
        this.shape_22.graphics.f().s("#CFD1D2").p("EA1DAQVMhqFggp");
        this.shape_22.setTransform(402.1, 447.8);

        this.shape_23 = new cjs.Shape();
        this.shape_23.graphics.f().s("#CFD1D2").p("EBJQAVVMiSfgqp");
        this.shape_23.setTransform(536.8, 413.8);

        this.shape_24 = new cjs.Shape();
        this.shape_24.graphics.f().s("#CFD1D2").p("EBPJAUUMieQgon");
        this.shape_24.setTransform(585.1, 361.3);

        this.shape_25 = new cjs.Shape();
        this.shape_25.graphics.f().s("#CFD1D2").p("EBOIAScMicPgk3");
        this.shape_25.setTransform(598.6, 297.3);

        this.shape_26 = new cjs.Shape();
        this.shape_26.graphics.f().s("#CFD1D2").p("EBBeANrMiC7gbV");
        this.shape_26.setTransform(688.6, 259.8);

        this.shape_27 = new cjs.Shape();
        this.shape_27.graphics.f().s("#CFD1D2").p("EAx7AJiMhj1gTD");
        this.shape_27.setTransform(800.1, 233.3);

        this.shape_28 = new cjs.Shape();
        this.shape_28.graphics.f().s("#CFD1D2").p("EAmhAGfMhNBgM9");
        this.shape_28.setTransform(883.1, 204.8);

        this.shape_29 = new cjs.Shape();
        this.shape_29.graphics.f().s("#CFD1D2").p("ALOnGI2bON");
        this.shape_29.setTransform(121.4, 216.8);

        this.shape_30 = new cjs.Shape();
        this.shape_30.graphics.f().s("#CFD1D2").p("AQxq7MghhAV3");
        this.shape_30.setTransform(173.9, 237.3);

        this.shape_31 = new cjs.Shape();
        this.shape_31.graphics.f().s("#CFD1D2").p("AY5vnMgxxAfP");
        this.shape_31.setTransform(215.9, 266.3);

        this.shape_32 = new cjs.Shape();
        this.shape_32.graphics.f().s("#CFD1D2").p("Ack1jMg5HArH");
        this.shape_32.setTransform(266.4, 300.3);

        this.shape_33 = new cjs.Shape();
        this.shape_33.graphics.f().s("#CFD1D2").p("EAiggajMhE/A1H");
        this.shape_33.setTransform(301.4, 345.3);

        this.shape_34 = new cjs.Shape();
        this.shape_34.graphics.f().s("#CFD1D2").p("Adg68Mg6/A15");
        this.shape_34.setTransform(395.4, 345.8);

        this.shape_35 = new cjs.Shape();
        this.shape_35.graphics.f().s("#CFD1D2").p("AZ96tMgz5A1b");
        this.shape_35.setTransform(486.8, 344.3);

        this.shape_36 = new cjs.Shape();
        this.shape_36.graphics.f().s("#CFD1D2").p("AXw6tMgvfA1b");
        this.shape_36.setTransform(585.6, 346.3);

        this.shape_37 = new cjs.Shape();
        this.shape_37.graphics.f().s("#CFD1D2").p("AVL7BMgqVA2D");
        this.shape_37.setTransform(665.1, 349.3);

        this.shape_38 = new cjs.Shape();
        this.shape_38.graphics.f().s("#CFD1D2").p("ARl7GMgjJA2N");
        this.shape_38.setTransform(754.1, 345.8);

        this.shape_39 = new cjs.Shape();
        this.shape_39.graphics.f().s("#CFD1D2").p("AQG8CMggLA4F");
        this.shape_39.setTransform(834.6, 349.8);

        this.shape_40 = new cjs.Shape();
        this.shape_40.graphics.f().s("#CFD1D2").p("AM07uMgZnA3d");
        this.shape_40.setTransform(932.6, 346.8);

        this.shape_41 = new cjs.Shape();
        this.shape_41.graphics.f().s("#CFD1D2").p("AK38MMgVtA4Z");
        this.shape_41.setTransform(1022.1, 354.8);

        this.shape_42 = new cjs.Shape();
        this.shape_42.graphics.lf(["#DEDFE0", "#E9E9EA"], [0, 1], 66.2, -99.7, -60.4, 91.1).s().p("EhMcAZBMgATgyEMCZfAAQMAAAAx3g");
        this.shape_42.setTransform(595.8, 342.9);

        this.timeline.addTween(cjs.Tween.get({}).to({state: [{t: this.shape_42}, {t: this.shape_41}, {t: this.shape_40}, {t: this.shape_39}, {t: this.shape_38}, {t: this.shape_37}, {t: this.shape_36}, {t: this.shape_35}, {t: this.shape_34}, {t: this.shape_33}, {t: this.shape_32}, {t: this.shape_31}, {t: this.shape_30}, {t: this.shape_29}, {t: this.shape_28}, {t: this.shape_27}, {t: this.shape_26}, {t: this.shape_25}, {t: this.shape_24}, {t: this.shape_23}, {t: this.shape_22}, {t: this.shape_21}, {t: this.shape_20}, {t: this.shape_19}, {t: this.shape_18}, {t: this.shape_17}, {t: this.shape_16}, {t: this.shape_15}, {t: this.shape_14}, {t: this.shape_13}, {t: this.shape_12}, {t: this.shape_11}, {t: this.shape_10}, {t: this.shape_9}, {t: this.shape_8}, {t: this.shape_7}, {t: this.shape_6}, {t: this.shape_5}, {t: this.shape_4}, {t: this.shape_3}, {t: this.shape_2}, {t: this.shape_1}, {t: this.shape}]}).wait(1));

    }).prototype = p = new cjs.MovieClip();
    p.nominalBounds = new cjs.Rectangle(47.5, 160.7, 1083.1, 392.6);


    (lib.Path = function (mode, startPosition, loop) {
        this.initialize(mode, startPosition, loop, {});

        // Vrstva 1
        this.shape = new cjs.Shape();
        this.shape.graphics.f("#02BBA6").s().p("AyvLUIAA2oMAlfAAAIAAWog");
        this.shape.setTransform(120, 72.5);

        this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

    }).prototype = p = new cjs.MovieClip();
    p.nominalBounds = new cjs.Rectangle(0, 0, 240.1, 145);


    (lib.Path_1 = function (mode, startPosition, loop) {
        this.initialize(mode, startPosition, loop, {});

        // Vrstva 1
        this.shape_1 = new cjs.Shape();
        this.shape_1.graphics.f("#FFFFFF").s().p("Ego2gETIMWolMBFXAPJI0sKng");
        this.shape_1.setTransform(261.5, 82.5);

        this.timeline.addTween(cjs.Tween.get(this.shape_1).wait(1));

    }).prototype = p = new cjs.MovieClip();
    p.nominalBounds = new cjs.Rectangle(0, 0, 523.1, 165);


    (lib.drobky = function (mode, startPosition, loop) {
        this.initialize(mode, startPosition, loop, {});

        // Vrstva 1
        this.shape = new cjs.Shape();
        this.shape.graphics.f("#59595B").s().p("AgbA4IAAgOIAEAAQAIAAAEgJIAFgNIgdhLIARAAIASA3IATg3IARAAIgkBfQAAAGgDAEQgHAGgLAAg");
        this.shape.setTransform(125.8, 139);

        this.shape_1 = new cjs.Shape();
        this.shape_1.graphics.f("#59595B").s().p("AAPA5IgVgmIgMANIAAAZIgQAAIAAhxIAQAAIAABFIAegkIAUAAIgcAeIAfAyg");
        this.shape_1.setTransform(117.9, 135.8);

        this.shape_2 = new cjs.Shape();
        this.shape_2.graphics.f("#59595B").s().p("AgQAvIAAAJIgQAAIAAhwIAQAAIAAApQAIgJAMAAQAMAAAHAHQAKAJAAAXQAAAagKAIQgHAIgMAAQgMAAgIgKgAgQAPQAAAcAQAAQAJAAAEgJQADgGAAgNQAAgNgDgDQgEgIgJAAQgQAAAAAYg");
        this.shape_2.setTransform(108.7, 135.9);

        this.shape_3 = new cjs.Shape();
        this.shape_3.graphics.f("#59595B").s().p("AgXAfQgJgKAAgVQAAgUAJgLQAKgJANAAQAPAAAJAJQAJAKAAAVQAAAWgJAJQgJAKgPAAQgNAAgKgKgAgKgVQgGAFAAAQQAAAQAGAFQAFAFAFABQAHgBAFgFQAFgFAAgQQAAgQgFgFQgFgFgHABQgGgBgEAFg");
        this.shape_3.setTransform(99.6, 137.5);

        this.shape_4 = new cjs.Shape();
        this.shape_4.graphics.f("#59595B").s().p("AgbApIAAhQIAQAAIAAAJQAGgKAOABQAMgBAHAIIgMANQgGgGgHAAQgEAAgFAFQgFAFAAAIIAAAwg");
        this.shape_4.setTransform(92.8, 137.4);

        this.shape_5 = new cjs.Shape();
        this.shape_5.graphics.f("#59595B").s().p("AgXAxQgJgIAAgaQAAgXAJgJQAHgHANAAQAMAAAHAJIAAgpIARAAIAABwIgQAAIAAgJQgIAKgMAAQgMAAgIgIgAgMgBQgDADAAANQAAANADAGQAEAJAIAAQAKAAADgJQADgGAAgNQAAgNgDgDQgDgIgKAAQgIAAgEAIg");
        this.shape_5.setTransform(83.8, 135.9);

        this.shape_6 = new cjs.Shape();
        this.shape_6.graphics.f("#59595B").s().p("AgZAhQgGgGAAgLQAAgKAHgGQAHgFAOAAIATAAIAAgGQAAgPgQAAQgLAAgGAHIgLgKQAKgLASAAQAgAAAAAbIAAA1IgQAAIAAgIQgIAJgLAAQgOAAgIgIgAgPAPQAAAMAOAAQAJAAAFgFQADgDAAgIIAAgHIgRAAQgOAAAAALg");
        this.shape_6.setTransform(70.9, 137.5);

        this.shape_7 = new cjs.Shape();
        this.shape_7.graphics.f("#59595B").s().p("AgXAhQgJgIAAgPIAAgyIARAAIAAAwQAAASAPAAQAQAAAAgSIAAgwIARAAIAABQIgQAAIAAgJQgJAKgLAAQgNAAgHgIg");
        this.shape_7.setTransform(58.2, 137.5);

        this.shape_8 = new cjs.Shape();
        this.shape_8.graphics.f("#59595B").s().p("AAQA5IAAgzQAAgPgQAAQgPAAAAAPIAAAzIgQAAIAAhxIAQAAIAAAqQAJgJAKAAQANAAAIAHQAHAIAAAMIAAA1g");
        this.shape_8.setTransform(49.1, 135.8);

        this.shape_9 = new cjs.Shape();
        this.shape_9.graphics.f("#59595B").s().p("AgTAfQgLgLAAgUQAAgUALgLQAKgJANAAQAQAAALALIgLALQgIgIgIABQgHAAgGAGQgFAHABAMQgBANAFAGQAGAIAHAAQAIgBAIgHIALAKQgMAMgPAAQgNAAgKgKg");
        this.shape_9.setTransform(40.6, 137.5);

        this.shape_10 = new cjs.Shape();
        this.shape_10.graphics.f("#59595B").s().p("AgZAhQgGgHgBgKQAAgKAIgGQAHgFANAAIAUAAIAAgGQAAgPgQAAQgLAAgGAHIgLgKQAKgLASAAQAhAAgBAbIAAA1IgPAAIAAgIQgJAJgLAAQgOAAgIgIgAgPAPQgBAMAPAAQAJAAAEgFQAEgDAAgIIAAgHIgRAAQgOAAAAALg");
        this.shape_10.setTransform(31.9, 137.5);

        this.shape_11 = new cjs.Shape();
        this.shape_11.graphics.f("#59595B").s().p("AgbApIAAhQIAQAAIAAAJQAGgKAOABQALgBAIAIIgNANQgEgGgIAAQgEAAgFAFQgEAFgBAIIAAAwg");
        this.shape_11.setTransform(25.1, 137.4);

        this.shape_12 = new cjs.Shape();
        this.shape_12.graphics.f("#59595B").s().p("AggA5IAAhwIAQAAIAAAJQAIgKAMAAQANAAAHAHQAJAJAAAZQAAAYgJAJQgIAHgMAAQgMAAgHgJIAAApgAgMghQgDAGAAAMQAAANADAEQAEAJAIAAQAKAAADgJQADgEAAgNQAAgMgDgGQgDgIgKAAQgIAAgEAIg");
        this.shape_12.setTransform(16.5, 139);

        this.shape_13 = new cjs.Shape();
        this.shape_13.graphics.f("#59595B").s().p("AghAAQAAgSAKgLQAJgLAOAAQAPAAAKALQAJALAAARIAAAFIgzAAQAAAXATAAQALAAAJgJIAKAKQgMANgSAAQgjAAAAgpgAgPgQQgCAFAAAFIAjAAQAAgFgDgFQgEgLgLABQgLgBgEALg");
        this.shape_13.setTransform(107.9, 121.5);

        this.shape_14 = new cjs.Shape();
        this.shape_14.graphics.f("#59595B").s().p("AgSAfQgMgKAAgVQAAgUAMgLQAJgJANAAQAQAAALALIgLALQgIgHgIAAQgIgBgFAIQgEAFgBANQABANAEAGQAGAHAHABQAIAAAIgJIALALQgMAMgPAAQgNAAgJgKg");
        this.shape_14.setTransform(100, 121.5);

        this.shape_15 = new cjs.Shape();
        this.shape_15.graphics.f("#59595B").s().p("AAGA5QgKgBgGgGQgEgGgBgKIAAhaIAPAAIAABZQAAAJAIAAIAIAAIAAAPg");
        this.shape_15.setTransform(94.1, 119.8);

        this.shape_16 = new cjs.Shape();
        this.shape_16.graphics.f("#59595B").s().p("AgZAiQgGgHAAgLQAAgLAHgFQAHgFAOgBIATAAIAAgFQAAgPgQAAQgLgBgHAJIgKgKQAJgMATAAQAgAAAAAbIAAA1IgQAAIAAgHQgIAIgLAAQgPAAgHgHgAgQAQQAAALAPAAQAJAAAEgFQAEgDAAgJIAAgGIgRAAQgPAAAAAMg");
        this.shape_16.setTransform(86.5, 121.5);

        this.shape_17 = new cjs.Shape();
        this.shape_17.graphics.f("#59595B").s().p("AgFAoIgehPIARAAIASA3IATg3IARAAIgeBPg");
        this.shape_17.setTransform(78.8, 121.4);

        this.shape_18 = new cjs.Shape();
        this.shape_18.graphics.f("#59595B").s().p("AAQA5IAAgzQAAgPgQAAQgPAAAAAPIAAAzIgQAAIAAhxIAQAAIAAAqQAJgKAKABQANgBAIAJQAHAHAAAMIAAA1g");
        this.shape_18.setTransform(70.4, 119.8);

        this.shape_19 = new cjs.Shape();
        this.shape_19.graphics.f("#59595B").s().p("AgSAfQgMgKAAgVQAAgUAMgLQAJgJANAAQAQAAALALIgMALQgGgHgJAAQgHgBgGAIQgFAFAAANQAAANAFAGQAGAHAHABQAIAAAHgJIAMALQgMAMgPAAQgNAAgJgKg");
        this.shape_19.setTransform(61.9, 121.5);

        this.shape_20 = new cjs.Shape();
        this.shape_20.graphics.f("#59595B").s().p("AgXAhQgIgIAAgPIAAgyIAQAAIAAAwQAAASAPAAQAGAAAFgEQAFgFAAgJIAAgwIAQAAIAABQIgQAAIAAgJQgIAKgLAAQgMAAgIgIg");
        this.shape_20.setTransform(53.1, 121.5);

        this.shape_21 = new cjs.Shape();
        this.shape_21.graphics.f("#59595B").s().p("AAQA5IAAgzQAAgPgQAAQgPAAAAAPIAAAzIgQAAIAAhxIAQAAIAAAqQAJgKAKABQAOgBAHAJQAHAHAAAMIAAA1g");
        this.shape_21.setTransform(44, 119.8);

        this.shape_22 = new cjs.Shape();
        this.shape_22.graphics.f("#59595B").s().p("AgcAtQgIgIgCgKQgCgIAAgTQAAgSACgHQACgLAIgJQAMgLAQgBQAPAAAMAJQALAKACARIgSAAQgEgUgSAAQgJAAgGAHQgFAEgBAIQgBAGAAAQQAAARABAGQABAIAFAEQAHAHAIAAQASAAAFgUIARAAQgCARgLAKQgMAJgPgBQgQAAgMgMg");
        this.shape_22.setTransform(34.4, 119.8);

        this.shape_23 = new cjs.Shape();
        this.shape_23.graphics.f().s("#67B7A4").p("AqDiQIBsAAIgFiMIB6CMIQmAAIAAG1I0HAAg");
        this.shape_23.setTransform(71.5, 120.5);

        this.shape_24 = new cjs.Shape();
        this.shape_24.graphics.f("#FFFFFF").s().p("AqDEhIAAm1IBsAAIgFiMIB6CMIQmAAIAAG1g");
        this.shape_24.setTransform(71.5, 121);

        this.timeline.addTween(cjs.Tween.get({}).to({state: [{t: this.shape_24}, {t: this.shape_23}, {t: this.shape_22}, {t: this.shape_21}, {t: this.shape_20}, {t: this.shape_19}, {t: this.shape_18}, {t: this.shape_17}, {t: this.shape_16}, {t: this.shape_15}, {t: this.shape_14}, {t: this.shape_13}, {t: this.shape_12}, {t: this.shape_11}, {t: this.shape_10}, {t: this.shape_9}, {t: this.shape_8}, {t: this.shape_7}, {t: this.shape_6}, {t: this.shape_5}, {t: this.shape_4}, {t: this.shape_3}, {t: this.shape_2}, {t: this.shape_1}, {t: this.shape}]}).wait(1));

    }).prototype = p = new cjs.MovieClip();
    p.nominalBounds = new cjs.Rectangle(6, 90.6, 131, 60.4);


    (lib.Doplnění16 = function (mode, startPosition, loop) {
        this.initialize(mode, startPosition, loop, {});

        // Vrstva 1
        this.instance = new lib.DuoroXmotor2();
        this.instance.setTransform(-84, -82.5);

        this.shape = new cjs.Shape();
        this.shape.graphics.f("#FFFFFF").s().p("AlAL3QiTg+hzhyQhyhyg/iVQhBiZAAinQAAinBBiZQA/iUByhyQBzhyCTg/QCZhBCnAAQCnAACZBBQCVA/ByByQByByA+CUQBBCZAACnQAACnhBCZQg+CVhyByQhyByiVA+QiZBBinAAQinAAiZhBg");
        this.shape.setTransform(0.1, 1.9, 0.96, 0.96);

        this.timeline.addTween(cjs.Tween.get({}).to({state: [{t: this.shape}, {t: this.instance}]}).wait(1));

    }).prototype = p = new cjs.MovieClip();
    p.nominalBounds = new cjs.Rectangle(-84, -82.5, 168, 165);


    (lib.Doplnění15 = function (mode, startPosition, loop) {
        this.initialize(mode, startPosition, loop, {});

        // Vrstva 1
        this.instance = new lib.DuoroXmotor2();
        this.instance.setTransform(-16.8, -16.5, 0.2, 0.2);

        this.shape = new cjs.Shape();
        this.shape.graphics.f("#FFFFFF").s().p("AlAL3QiTg+hzhyQhyhyg/iVQhBiZAAinQAAinBBiZQA/iUByhyQBzhyCTg/QCZhBCnAAQCnAACZBBQCVA/ByByQByByA+CUQBBCZAACnQAACnhBCZQg+CVhyByQhyByiVA+QiZBBinAAQinAAiZhBg");
        this.shape.setTransform(0, 0.4, 0.192, 0.192);

        this.timeline.addTween(cjs.Tween.get({}).to({state: [{t: this.shape}, {t: this.instance}]}).wait(1));

    }).prototype = p = new cjs.MovieClip();
    p.nominalBounds = new cjs.Rectangle(-16.8, -16.5, 33.6, 33);


    (lib.Doplnění12 = function (mode, startPosition, loop) {
        this.initialize(mode, startPosition, loop, {});

        // Vrstva 1
        this.instance = new lib.duoroXvybava2();
        this.instance.setTransform(-74, -49);

        this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

    }).prototype = p = new cjs.MovieClip();
    p.nominalBounds = new cjs.Rectangle(-74, -49, 233, 208);


    (lib.Doplnění8 = function (mode, startPosition, loop) {
        this.initialize(mode, startPosition, loop, {});

        // FlashAICB
        this.shape = new cjs.Shape();
        this.shape.graphics.f("#02BBA6").s().p("AAzBfIhkiXIAACXIgUAAIAAi9IATAAIBkCXIAAiXIAUAAIAAC9g");
        this.shape.setTransform(777.5, -21.8, 0.8, 0.8);

        this.shape_1 = new cjs.Shape();
        this.shape_1.graphics.f("#02BBA6").s().p("AA5BfIgQgrIhRAAIgPArIgWAAIBGi9IAPAAIBGC9gAgiAjIBFAAIgjhkg");
        this.shape_1.setTransform(763.5, -21.8, 0.8, 0.8);

        this.shape_2 = new cjs.Shape();
        this.shape_2.graphics.f("#02BBA6").s().p("Ag6BfIAAi9IB1AAIAAASIhhAAIAABEIBTAAIAAAQIhTAAIAABFIBhAAIAAASg");
        this.shape_2.setTransform(751.4, -21.8, 0.8, 0.8);

        this.shape_3 = new cjs.Shape();
        this.shape_3.graphics.f("#02BBA6").s().p("Ag6BfIAAi9IAVAAIAACrIBgAAIAAASg");
        this.shape_3.setTransform(739.5, -21.8, 0.8, 0.8);

        this.shape_4 = new cjs.Shape();
        this.shape_4.graphics.f("#02BBA6").s().p("AgvBNQgNgNgDgSQgCgMAAgiQAAgiACgMQADgSANgMQAUgUAbAAQAaAAASAPQARAPAFAbIgVAAQgEgSgLgKQgNgLgRAAQgSAAgNAOQgJAJgCANQgDAMAAAeQAAAfADAMQACANAJAJQANANASAAQASAAAMgKQAMgKAEgSIAUAAQgFAagSAQQgRAPgaAAQgbAAgUgUg");
        this.shape_4.setTransform(726.3, -21.8, 0.8, 0.8);

        this.shape_5 = new cjs.Shape();
        this.shape_5.graphics.f("#02BBA6").s().p("AAzBfIgzhJIgzBJIgpAAIBKhgIhGhdIAqAAIAuBFIAvhFIApAAIhFBdIBKBgg");
        this.shape_5.setTransform(709.4, -21.8, 0.8, 0.8);

        this.shape_6 = new cjs.Shape();
        this.shape_6.graphics.f("#02BBA6").s().p("AgdAdQgLgMgBgRQABgQALgNQANgMAQAAQARAAAMAMQAMANAAAQQAAARgMAMQgMAMgRAAQgQAAgNgMgAgYgYQgKALAAANQAAAOAKAKQALALANAAQAOAAALgLQAJgKABgOQgBgNgJgLQgLgKgOAAQgNAAgLAKgAAKAWIgKgTIgGAAIAAATIgHAAIAAgsIAOAAQAGAAAFAFQAEAEAAAFQAAAIgKACIALAUgAgGAAIAHAAQADAAADgDQACgCABgDQgBgDgCgCQgDgDgDAAIgHAAg");
        this.shape_6.setTransform(694.3, -27.3, 0.8, 0.8);

        this.shape_7 = new cjs.Shape();
        this.shape_7.graphics.f("#02BBA6").s().p("AgyBQQgMgNgDgSQgDgNAAgkQAAgjADgMQACgTANgNQAWgVAcAAQAdAAAWAVQANANACATQADAMAAAjQAAAkgDANQgCASgNANQgWAVgdAAQgcAAgWgVgAghhCQgJAJgCAOQgDAMAAAfQAAAgADAMQACAOAJAJQAPAPASAAQAVAAANgPQAJgJACgOQADgMAAggQAAgfgDgMQgCgOgJgJQgNgPgVAAQgSAAgPAPg");
        this.shape_7.setTransform(683, -22.1, 0.8, 0.8);

        this.shape_8 = new cjs.Shape();
        this.shape_8.graphics.f("#02BBA6").s().p("AAsBjIgshYIgvAAIAABYIgVAAIAAjFIBKAAQAaAAAQAPQARAPAAAZQAAAWgMAOQgLAMgVAEIAwBagAgvgGIAzAAQASAAALgJQAKgKABgRQgBgSgKgKQgLgJgSAAIgzAAg");
        this.shape_8.setTransform(668.9, -22.1, 0.8, 0.8);

        this.shape_9 = new cjs.Shape();
        this.shape_9.graphics.f("#02BBA6").s().p("AgxBQQgNgNgEgSQgCgNAAgkQAAgjACgMQAEgTANgNQAUgVAdAAQAdAAAVAVQANANAEATQACAMAAAjQAAAkgCANQgEASgNANQgVAVgdAAQgdAAgUgVgAghhCQgJAJgDAOQgCALAAAgQAAAhACALQADAOAJAJQAOAPATAAQAUAAAOgPQAJgJACgOQADgMAAggQAAgfgDgMQgCgOgJgJQgOgPgUAAQgTAAgOAPg");
        this.shape_9.setTransform(653.8, -22.1, 0.8, 0.8);

        this.shape_10 = new cjs.Shape();
        this.shape_10.graphics.f("#02BBA6").s().p("AgxBRQgTgTAAgeIAAiDIAVAAIAACCQAAAWAOAOQAMAOAVAAQAVAAAOgOQANgOgBgWIAAiCIAWAAIAACDQAAAegUATQgTATgeAAQgdAAgUgTg");
        this.shape_10.setTransform(638.9, -22, 0.8, 0.8);

        this.shape_11 = new cjs.Shape();
        this.shape_11.graphics.f("#02BBA6").s().p("AhEBjIAAjFIBEAAQAeAAATASQAOAOADAXQACANAAAdQAAAdgCANQgDAagOAOQgTASgeAAgAgvBQIAsAAQAXAAAOgPQAJgJADgVQABgLAAgZQAAgZgBgKQgDgTgJgJQgOgPgXAAIgsAAg");
        this.shape_11.setTransform(624.1, -22.1, 0.8, 0.8);

        this.timeline.addTween(cjs.Tween.get({}).to({state: [{t: this.shape_11}, {t: this.shape_10}, {t: this.shape_9}, {t: this.shape_8}, {t: this.shape_7}, {t: this.shape_6}, {t: this.shape_5}, {t: this.shape_4}, {t: this.shape_3}, {t: this.shape_2}, {t: this.shape_1}, {t: this.shape}]}).wait(1));

    }).prototype = p = new cjs.MovieClip();
    p.nominalBounds = new cjs.Rectangle(618.6, -30.7, 164.6, 16.7);


    (lib.Doplnění5 = function (mode, startPosition, loop) {
        this.initialize(mode, startPosition, loop, {});

        // Vrstva 1
        this.shape = new cjs.Shape();
        this.shape.graphics.f("#E06618").s().p("AgQgdIAtAnIg5AUg");
        this.shape.setTransform(25.5, -25.7);

        this.shape_1 = new cjs.Shape();
        this.shape_1.graphics.f().s("#E06618").ss(0.6, 0, 0, 4).p("AiOgaIEeA1");
        this.shape_1.setTransform(9, -28.4);

        this.shape_2 = new cjs.Shape();
        this.shape_2.graphics.f("#E06618").s().p("AgOgdIArApIg5ASg");
        this.shape_2.setTransform(24, -17);

        this.shape_3 = new cjs.Shape();
        this.shape_3.graphics.f().s("#E06618").ss(0.6, 0, 0, 4).p("AiSgqIElBV");
        this.shape_3.setTransform(8.5, -21.1);

        this.shape_4 = new cjs.Shape();
        this.shape_4.graphics.f("#E06618").s().p("AgBgaIAgAyIg9ADg");
        this.shape_4.setTransform(21.4, -7.5);

        this.shape_5 = new cjs.Shape();
        this.shape_5.graphics.f().s("#E06618").ss(0.6, 0, 0, 4).p("AiRg+IEjB9");
        this.shape_5.setTransform(6.7, -13.2);

        this.shape_6 = new cjs.Shape();
        this.shape_6.graphics.f("#E06618").s().p("AgeAZIAfgzIAeA1g");
        this.shape_6.setTransform(17.9, 0.8);

        this.shape_7 = new cjs.Shape();
        this.shape_7.graphics.f().s("#E06618").ss(0.6, 0, 0, 4).p("AiJhUIETCp");
        this.shape_7.setTransform(3.4, -7.3);

        this.shape_8 = new cjs.Shape();
        this.shape_8.graphics.f("#E06618").s().p("AgdAVIAjgwIAZA3g");
        this.shape_8.setTransform(13.9, 8.8);

        this.shape_9 = new cjs.Shape();
        this.shape_9.graphics.f().s("#E06618").ss(0.6, 0, 0, 4).p("AiGhhIENDD");
        this.shape_9.setTransform(-0.2, -0.8);

        this.shape_10 = new cjs.Shape();
        this.shape_10.graphics.f("#E06618").s().p("AgcAQIAngsIASA5g");
        this.shape_10.setTransform(6.2, 16.1);

        this.shape_11 = new cjs.Shape();
        this.shape_11.graphics.f().s("#E06618").ss(0.6, 0, 0, 4).p("Ah4hxIDxDj");
        this.shape_11.setTransform(-6, 4.8);

        this.shape_12 = new cjs.Shape();
        this.shape_12.graphics.f("#E06618").s().p("AgcALIAsgoIANA7g");
        this.shape_12.setTransform(-1.2, 22.5);

        this.shape_13 = new cjs.Shape();
        this.shape_13.graphics.f().s("#E06618").ss(0.6, 0, 0, 4).p("Ahqh8IDVD5");
        this.shape_13.setTransform(-12, 10.1);

        this.shape_14 = new cjs.Shape();
        this.shape_14.graphics.f("#E06618").s().p("AgbAFIAxgjIAGA8g");
        this.shape_14.setTransform(-10.3, 28.1);

        this.shape_15 = new cjs.Shape();
        this.shape_15.graphics.f().s("#E06618").ss(0.6, 0, 0, 4).p("AhaiDIC1EH");
        this.shape_15.setTransform(-19.3, 14.1);

        this.timeline.addTween(cjs.Tween.get({}).to({state: [{t: this.shape_15}, {t: this.shape_14}, {t: this.shape_13}, {t: this.shape_12}, {t: this.shape_11}, {t: this.shape_10}, {t: this.shape_9}, {t: this.shape_8}, {t: this.shape_7}, {t: this.shape_6}, {t: this.shape_5}, {t: this.shape_4}, {t: this.shape_3}, {t: this.shape_2}, {t: this.shape_1}, {t: this.shape}]}).wait(1));

    }).prototype = p = new cjs.MovieClip();
    p.nominalBounds = new cjs.Rectangle(-29.4, -32.1, 57.8, 63.3);


    (lib.Doplnění4 = function (mode, startPosition, loop) {
        this.initialize(mode, startPosition, loop, {});

        // Vrstva 1
        this.instance = new lib.DuoroX190();
        this.instance.setTransform(-77, -21);

        this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

    }).prototype = p = new cjs.MovieClip();
    p.nominalBounds = new cjs.Rectangle(-77, -21, 190, 143);


    (lib.Doplnění1 = function (mode, startPosition, loop) {
        this.initialize(mode, startPosition, loop, {});

        // Vrstva 1
        this.shape = new cjs.Shape();
        this.shape.graphics.f("#79D6A4").s().p("AgdACIAhgGIAagUIgPAxg");
        this.shape.setTransform(-36, -54.1);

        this.shape_1 = new cjs.Shape();
        this.shape_1.graphics.f("#79D6A4").s().p("AgEgDIgUgXIAxANIgXAog");
        this.shape_1.setTransform(-61.1, 36.5);

        this.shape_2 = new cjs.Shape();
        this.shape_2.graphics.f("#79D6A4").s().p("AgEgDIgVgYIAzAMIgWArg");
        this.shape_2.setTransform(-53.7, 32.9);

        this.shape_3 = new cjs.Shape();
        this.shape_3.graphics.f("#79D6A4").s().p("AgFgDIgVgZIA0APIgZAqg");
        this.shape_3.setTransform(-43, 27.2);

        this.shape_4 = new cjs.Shape();
        this.shape_4.graphics.f("#79D6A4").s().p("AgHgCIgPgaIAtAVIgcAkg");
        this.shape_4.setTransform(-74.5, 19.7);

        this.shape_5 = new cjs.Shape();
        this.shape_5.graphics.f("#79D6A4").s().p("AgJAAIgDgeIAiAlIgrAYg");
        this.shape_5.setTransform(-56, -4.8);

        this.shape_6 = new cjs.Shape();
        this.shape_6.graphics.f("#79D6A4").s().p("AgHgCIgRgbIAxAUIgbAng");
        this.shape_6.setTransform(-65.1, 16.9);

        this.shape_7 = new cjs.Shape();
        this.shape_7.graphics.f("#79D6A4").s().p("AgIgCIgQgcIAxAXIgfAmg");
        this.shape_7.setTransform(-55, 13.4);

        this.shape_8 = new cjs.Shape();
        this.shape_8.graphics.f("#79D6A4").s().p("AgGAAIACgiIAgAxIg3AUg");
        this.shape_8.setTransform(-77.9, -9);

        this.shape_9 = new cjs.Shape();
        this.shape_9.graphics.f("#79D6A4").s().p("AAAACIALggIATA4Ig7AFg");
        this.shape_9.setTransform(-69, -31.8);

        this.shape_10 = new cjs.Shape();
        this.shape_10.graphics.f("#79D6A4").s().p("AggAVIAngVIAZghIABBDg");
        this.shape_10.setTransform(-51.3, -42.6);

        this.shape_11 = new cjs.Shape();
        this.shape_11.graphics.f("#79D6A4").s().p("AgYASIAdgSIARgZIADAzg");
        this.shape_11.setTransform(-56.6, -47.8);

        this.shape_12 = new cjs.Shape();
        this.shape_12.graphics.f("#79D6A4").s().p("AgJAAIgEgeIAjAlIgrAYg");
        this.shape_12.setTransform(-66.7, -6.7);

        this.shape_13 = new cjs.Shape();
        this.shape_13.graphics.f("#79D6A4").s().p("AAAACIAKgbIAQAwIgzADg");
        this.shape_13.setTransform(-61, -27);

        this.shape_14 = new cjs.Shape();
        this.shape_14.graphics.f("#79D6A4").s().p("AgBACIAIgiIAYA4Ig8AJg");
        this.shape_14.setTransform(-52, -22.6);

        this.shape_15 = new cjs.Shape();
        this.shape_15.graphics.f("#79D6A4").s().p("AgYAPIAegPIATgZIAAAzg");
        this.shape_15.setTransform(-45.1, -35.9);

        this.shape_16 = new cjs.Shape();
        this.shape_16.graphics.f("#79D6A4").s().p("AgbAJIAggLIAXgWIgIAxg");
        this.shape_16.setTransform(-30.5, -46.2);

        this.shape_17 = new cjs.Shape();
        this.shape_17.graphics.f().s("#79D6A4").ss(0.3, 0, 0, 4).p("AiCBCIEFiD");
        this.shape_17.setTransform(-46.6, 29);

        this.shape_18 = new cjs.Shape();
        this.shape_18.graphics.f().s("#79D6A4").ss(0.3, 0, 0, 4).p("AizA1IFnhp");
        this.shape_18.setTransform(-58.4, 14.6);

        this.shape_19 = new cjs.Shape();
        this.shape_19.graphics.f().s("#79D6A4").ss(0.3, 0, 0, 4).p("AjAgaIGAA1");
        this.shape_19.setTransform(-66, -6.1);

        this.shape_20 = new cjs.Shape();
        this.shape_20.graphics.f().s("#79D6A4").ss(0.3, 0, 0, 4).p("AiihVIFFCr");
        this.shape_20.setTransform(-58.4, -25);

        this.shape_21 = new cjs.Shape();
        this.shape_21.graphics.f().s("#79D6A4").ss(0.3, 0, 0, 4).p("AhnhpIDPDT");
        this.shape_21.setTransform(-45.5, -36.7);

        this.shape_22 = new cjs.Shape();
        this.shape_22.graphics.f().s("#79D6A4").ss(0.3, 0, 0, 4).p("AhChXICFCv");
        this.shape_22.setTransform(-29.7, -45.5);

        this.shape_23 = new cjs.Shape();
        this.shape_23.graphics.f().s("#79D6A4").ss(0.3, 0, 0, 4).p("AMfBkQgPBuhNBdQhKBah5A+QkBCClJgqQlLgojUi+QhlhYgvhqQgxhtAQhtQAPhuBNheQBKhaB6g9QEAiCFJApQFLAqDUC8QBlBZAvBpQAxBtgQBug");
        this.shape_23.setTransform(-5, -1.5);

        this.shape_24 = new cjs.Shape();
        this.shape_24.graphics.f().s("#79D6A4").ss(0.3, 0, 0, 4).p("AK2BBQgXDfjcCKQjcCLkegbQkfgbi7ixQi7ixAXjdQAXjfDciKQDciLEeAbQEfAcC7CwQC8CxgYDdg");
        this.shape_24.setTransform(-5.5, -1.4);

        this.shape_25 = new cjs.Shape();
        this.shape_25.graphics.f().s("#79D6A4").ss(0.3, 0, 0, 4).p("AK2BBQgXDfjcCKQjcCLkegbQkfgci7iwQi7ixAXjdQAXjfDciKQDciLEeAbQEfAbC7CxQC8CxgYDdg");
        this.shape_25.setTransform(2, 0);

        this.shape_26 = new cjs.Shape();
        this.shape_26.graphics.f().s("#79D6A4").ss(0.5, 0, 0, 4).p("AK2BBQgXDfjcCKQjcCLkegbQkfgbi7ixQi7ixAXjdQAXjfDciKQDciLEeAcQEfAbC7CwQC8CxgYDdg");
        this.shape_26.setTransform(9.3, 2.6);

        this.shape_27 = new cjs.Shape();
        this.shape_27.graphics.f().s("#79D6A4").ss(0.7, 0, 0, 4).p("AK2BBQgXDcjcCIQjcCJkdgbQkggbi7ivQi7ivAXjaQAXjcDbiIQDciJEeAbQEfAbC8CvQC7CvgXDag");
        this.shape_27.setTransform(15.6, 2.6);

        this.timeline.addTween(cjs.Tween.get({}).to({state: [{t: this.shape_27}, {t: this.shape_26}, {t: this.shape_25}, {t: this.shape_24}, {t: this.shape_23}, {t: this.shape_22}, {t: this.shape_21}, {t: this.shape_20}, {t: this.shape_19}, {t: this.shape_18}, {t: this.shape_17}, {t: this.shape_16}, {t: this.shape_15}, {t: this.shape_14}, {t: this.shape_13}, {t: this.shape_12}, {t: this.shape_11}, {t: this.shape_10}, {t: this.shape_9}, {t: this.shape_8}, {t: this.shape_7}, {t: this.shape_6}, {t: this.shape_5}, {t: this.shape_4}, {t: this.shape_3}, {t: this.shape_2}, {t: this.shape_1}, {t: this.shape}]}).wait(1));

    }).prototype = p = new cjs.MovieClip();
    p.nominalBounds = new cjs.Rectangle(-86.3, -57.9, 172.6, 115.8);


    (lib.chuchv = function (mode, startPosition, loop) {
        this.initialize(mode, startPosition, loop, {});

        // Vrstva 1
        this.instance = new lib.chuchvalce2();
        this.instance.setTransform(73, -12);

        this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

    }).prototype = p = new cjs.MovieClip();
    p.nominalBounds = new cjs.Rectangle(73, -12, 233, 208);


    (lib.bublesrst = function (mode, startPosition, loop) {
        this.initialize(mode, startPosition, loop, {});

        // Vrstva 1
        this.shape = new cjs.Shape();
        this.shape.graphics.f("#59595B").s().p("AgbA4IAAgPIAEAAQAIAAAEgIIAEgNIgchLIARAAIASA3IASg3IASAAIgkBfQAAAGgEAEQgGAGgKAAg");
        this.shape.setTransform(132.2, 42);

        this.shape_1 = new cjs.Shape();
        this.shape_1.graphics.f("#59595B").s().p("AggAeIAKgLQAIAIAOAAQARAAAAgLQAAgJgKgBIgLgBQgYgCAAgSQAAgMAJgGQAIgHALAAQAUAAAKAJIgKAKQgIgFgMgBQgNAAAAALQAAAIALACIALABQAYACAAASQAAANgJAGQgJAHgPAAQgVAAgLgLg");
        this.shape_1.setTransform(124.2, 40.4);

        this.shape_2 = new cjs.Shape();
        this.shape_2.graphics.f("#59595B").s().p("AgZAiQgGgIgBgKQAAgKAIgGQAHgFANAAIAUAAIAAgGQAAgPgQAAQgMAAgFAIIgLgKQAKgMASAAQAhAAgBAcIAAA0IgPAAIAAgHQgIAIgMAAQgPAAgHgHgAgPAQQgBAMAPAAQAJAAAEgFQAEgEAAgIIAAgHIgRAAQgOAAAAAMg");
        this.shape_2.setTransform(115.6, 40.4);

        this.shape_3 = new cjs.Shape();
        this.shape_3.graphics.f("#59595B").s().p("AAFA4QgUAAAAgWIAAhZIAPAAIAABYQAAAKAIAAIAIAAIAAANg");
        this.shape_3.setTransform(109.4, 38.7);

        this.shape_4 = new cjs.Shape();
        this.shape_4.graphics.f("#59595B").s().p("AgFAoIgehPIARAAIASA3IATg3IARAAIgeBPg");
        this.shape_4.setTransform(102.6, 40.4);

        this.shape_5 = new cjs.Shape();
        this.shape_5.graphics.f("#59595B").s().p("AgZAiQgGgHgBgLQAAgKAHgGQAIgFANAAIAUAAIAAgGQAAgPgQAAQgMAAgFAIIgLgKQAKgMASAAQAhAAAAAcIAAA0IgQAAIAAgHQgJAIgMAAQgOAAgHgHgAgPAQQgBAMAPAAQAJAAAEgFQAEgEAAgIIAAgHIgRAAQgPAAABAMg");
        this.shape_5.setTransform(90.2, 40.4);

        this.shape_6 = new cjs.Shape();
        this.shape_6.graphics.f("#59595B").s().p("AAKA0QgKgBgEgGQgGgHAAgJIAAgrIgJAAIAAgMIAJAAIAAgZIAOAAIAAAZIAQAAIAAAMIgQAAIAAAqQAAAKAJAAIAHAAIAAAOg");
        this.shape_6.setTransform(148.9, 23.2);

        this.shape_7 = new cjs.Shape();
        this.shape_7.graphics.f("#59595B").s().p("AghAdIAMgKQAHAIAOAAQARAAAAgLQAAgJgLAAIgKgCQgYgCAAgSQgBgLAKgHQAIgHALAAQAUAAALAJIgLAKQgIgFgMAAQgMAAAAAKQAAAIALACIAKAAQAYADAAATQAAAMgJAHQgJAGgPAAQgVAAgMgMg");
        this.shape_7.setTransform(142.2, 24.4);

        this.shape_8 = new cjs.Shape();
        this.shape_8.graphics.f("#59595B").s().p("AgbApIAAhPIAQAAIAAAJQAHgKAMAAQAMAAAIAIIgNAMQgFgGgGAAQgGAAgEAFQgFAFAAAIIAAAwg");
        this.shape_8.setTransform(135.5, 24.3);

        this.shape_9 = new cjs.Shape();
        this.shape_9.graphics.f("#59595B").s().p("AghAdIALgKQAJAIANAAQARAAABgLQgBgJgKAAIgMgCQgYgCABgSQAAgLAJgHQAIgHALAAQAUAAAKAJIgKAKQgIgFgMAAQgNAAAAAKQAAAIAMACIAKAAQAZADAAATQAAAMgKAHQgKAGgOAAQgVAAgMgMg");
        this.shape_9.setTransform(127.1, 24.4);

        this.shape_10 = new cjs.Shape();
        this.shape_10.graphics.f("#59595B").s().p("AgOA8IAAhPIAOAAIAABPgAgNghIAMgaIAQAAIgQAag");
        this.shape_10.setTransform(117.6, 22.3);

        this.shape_11 = new cjs.Shape();
        this.shape_11.graphics.f("#59595B").s().p("AgSAfQgMgKAAgVQAAgUAMgLQAJgJANAAQAQAAALALIgLAMQgHgJgJABQgHAAgFAHQgGAHAAALQAAANAGAHQAFAHAHAAQAJAAAHgIIALAKQgKAMgRAAQgNAAgJgKg");
        this.shape_11.setTransform(110.9, 24.4);

        this.shape_12 = new cjs.Shape();
        this.shape_12.graphics.f("#59595B").s().p("AghAAQAAgSAKgLQAJgLAOAAQAQAAAJALQAJALAAARIAAAFIgzAAQAAAXATAAQALAAAJgIIAKAJQgMANgSAAQgjAAAAgpgAgPgQQgCAFAAAGIAjAAQAAgGgCgFQgFgKgLAAQgKAAgFAKg");
        this.shape_12.setTransform(102.4, 24.4);

        this.shape_13 = new cjs.Shape();
        this.shape_13.graphics.f("#59595B").s().p("AgZA8IAAhPIAQAAIAAAJQAHgKAMAAQAMAAAIAIIgMAMQgHgFgGAAQgFAAgEAFQgFADAAAIIAAAxgAgIghIgVgaIAOAAIAOAPIAMgPIANAAIgUAag");
        this.shape_13.setTransform(95.3, 22.3);

        this.shape_14 = new cjs.Shape();
        this.shape_14.graphics.f("#59595B").s().p("AgOA8IAAhPIAOAAIAABPgAgNghIAMgaIAQAAIgQAag");
        this.shape_14.setTransform(89.9, 22.3);

        this.shape_15 = new cjs.Shape();
        this.shape_15.graphics.f("#59595B").s().p("AgFAoIgehPIASAAIARA3IASg3IASAAIgeBPg");
        this.shape_15.setTransform(83.1, 24.4);

        this.shape_16 = new cjs.Shape();
        this.shape_16.graphics.f("#59595B").s().p("AgjA4IAAgOIAzhSIgxAAIAAgPIBFAAIAAAOIgzBSIAzAAIAAAPg");
        this.shape_16.setTransform(74.7, 22.7);

        this.shape_17 = new cjs.Shape();
        this.shape_17.graphics.f().s("#67B7A4").p("AnNCMIBqAAIBwCIIABiIIK/AAIAAmoIuaAAg");
        this.shape_17.setTransform(111.2, 38.5);

        this.shape_18 = new cjs.Shape();
        this.shape_18.graphics.f("#FFFFFF").s().p("AljCRIhqAAIAAmoIOaAAIAAGoIq+AAIgCCHg");
        this.shape_18.setTransform(111.2, 38.1);

        this.timeline.addTween(cjs.Tween.get({}).to({state: [{t: this.shape_18}, {t: this.shape_17}, {t: this.shape_16}, {t: this.shape_15}, {t: this.shape_14}, {t: this.shape_13}, {t: this.shape_12}, {t: this.shape_11}, {t: this.shape_10}, {t: this.shape_9}, {t: this.shape_8}, {t: this.shape_7}, {t: this.shape_6}, {t: this.shape_5}, {t: this.shape_4}, {t: this.shape_3}, {t: this.shape_2}, {t: this.shape_1}, {t: this.shape}]}).wait(1));

    }).prototype = p = new cjs.MovieClip();
    p.nominalBounds = new cjs.Rectangle(64, 9, 94.4, 60.5);


    (lib.bck2 = function (mode, startPosition, loop) {
        this.initialize(mode, startPosition, loop, {});

        // FlashAICB
        this.shape = new cjs.Shape();
        this.shape.graphics.f().s("#A4A4A6").p("AYJIcMgwRgQ3");
        this.shape.setTransform(212.5, 325);

        this.shape_1 = new cjs.Shape();
        this.shape_1.graphics.f().s("#A4A4A6").p("EA1DAQVMhqFggo");
        this.shape_1.setTransform(393.5, 290.5);

        this.shape_2 = new cjs.Shape();
        this.shape_2.graphics.f().s("#A4A4A6").p("EBJQAVVMiSfgqp");
        this.shape_2.setTransform(528.2, 256.5);

        this.shape_3 = new cjs.Shape();
        this.shape_3.graphics.f().s("#95959C").p("EBPJAUUMieRgom");
        this.shape_3.setTransform(576.5, 204);

        this.shape_4 = new cjs.Shape();
        this.shape_4.graphics.f().s("#777777").p("EBOIAScMicPgk3");
        this.shape_4.setTransform(590, 140);

        this.shape_5 = new cjs.Shape();
        this.shape_5.graphics.f().s("#7F7F87").p("EBBeANrMiC7gbV");
        this.shape_5.setTransform(680, 102.5);

        this.shape_6 = new cjs.Shape();
        this.shape_6.graphics.f().s("#9F9FA5").p("EAx7AJiMhj1gTD");
        this.shape_6.setTransform(791.5, 76);

        this.shape_7 = new cjs.Shape();
        this.shape_7.graphics.f().s("#A4A4A6").p("EAmhAGfMhNBgM9");
        this.shape_7.setTransform(874.5, 47.5);

        this.shape_8 = new cjs.Shape();
        this.shape_8.graphics.f().s("#999999").p("ALOnGI2bON");
        this.shape_8.setTransform(112.8, 59.5);

        this.shape_9 = new cjs.Shape();
        this.shape_9.graphics.f().s("#999999").p("AQxq7MghhAV3");
        this.shape_9.setTransform(165.3, 80);

        this.shape_10 = new cjs.Shape();
        this.shape_10.graphics.f().s("#999999").p("AYHwjMgwNAhH");
        this.shape_10.setTransform(202.3, 115);

        this.shape_11 = new cjs.Shape();
        this.shape_11.graphics.f().s("#999999").p("Ack1jMg5HArG");
        this.shape_11.setTransform(257.8, 143);

        this.shape_12 = new cjs.Shape();
        this.shape_12.graphics.f().s("#A4A4A6").p("EAiggaiMhE/A1G");
        this.shape_12.setTransform(292.8, 188);

        this.shape_13 = new cjs.Shape();
        this.shape_13.graphics.f().s("#A4A4A6").p("Adg68Mg6/A14");
        this.shape_13.setTransform(386.8, 188.5);

        this.shape_14 = new cjs.Shape();
        this.shape_14.graphics.f().s("#A4A4A6").p("AZ96sMgz5A1a");
        this.shape_14.setTransform(478.2, 187);

        this.shape_15 = new cjs.Shape();
        this.shape_15.graphics.f().s("#A4A4A6").p("AXw6sMgvfA1a");
        this.shape_15.setTransform(577, 189);

        this.shape_16 = new cjs.Shape();
        this.shape_16.graphics.f().s("#A4A4A6").p("AVL7BMgqVA2C");
        this.shape_16.setTransform(656.5, 192);

        this.shape_17 = new cjs.Shape();
        this.shape_17.graphics.f().s("#A4A4A6").p("ARl7FMgjJA2M");
        this.shape_17.setTransform(745.5, 188.5);

        this.shape_18 = new cjs.Shape();
        this.shape_18.graphics.f().s("#A4A4A6").p("AQG8BMggLA4E");
        this.shape_18.setTransform(826, 192.5);

        this.shape_19 = new cjs.Shape();
        this.shape_19.graphics.f().s("#A4A4A6").p("AM07uMgZnA3c");
        this.shape_19.setTransform(924, 189.5);

        this.shape_20 = new cjs.Shape();
        this.shape_20.graphics.f().s("#A4A4A6").p("AK38LMgVtA4Y");
        this.shape_20.setTransform(1013.5, 197.5);

        this.shape_21 = new cjs.Shape();
        this.shape_21.graphics.lf(["rgba(184,184,190,0.8)", "rgba(151,151,158,0.878)", "rgba(126,126,132,0.945)", "rgba(110,110,116,0.984)", "#69696E", "#B7B7BA", "#E6E6E7"], [0, 0.075, 0.149, 0.22, 0.271, 0.718, 1], 40.9, -152.7, -56.3, 210.3).s().p("EhMcAZBMgASgyEMCZdAAQMAAAAx3g");
        this.shape_21.setTransform(587.2, 185.6);

        this.timeline.addTween(cjs.Tween.get({}).to({state: [{t: this.shape_21}, {t: this.shape_20}, {t: this.shape_19}, {t: this.shape_18}, {t: this.shape_17}, {t: this.shape_16}, {t: this.shape_15}, {t: this.shape_14}, {t: this.shape_13}, {t: this.shape_12}, {t: this.shape_11}, {t: this.shape_10}, {t: this.shape_9}, {t: this.shape_8}, {t: this.shape_7}, {t: this.shape_6}, {t: this.shape_5}, {t: this.shape_4}, {t: this.shape_3}, {t: this.shape_2}, {t: this.shape_1}, {t: this.shape}]}).wait(1));

    }).prototype = p = new cjs.MovieClip();
    p.nominalBounds = new cjs.Rectangle(40, 4, 1082, 392);


    (lib.xmasbck = function (mode, startPosition, loop) {
        this.initialize(mode, startPosition, loop, {});

        // FlashAICB
        this.shape = new cjs.Shape();
        this.shape.graphics.f("#FFFFFF").s().p("AAZAsQgQATgZAAQgnAAAAgiQAAgSAMgJQAJgEATgEIAbgFQAMgEAAgJQAAgUgZAAQgdAAgBAXIgUAAQABgVAPgLQANgJAWAAQAsAAAAAhIAAA9QAAAIABACQABADAEAAIAGgBIAAAQQgEADgKAAQgRAAAAgTgAAIADIgSADQgZAEAAASQAAARAYAAQAQAAALgJQAIgIAAgKIAAgSQgFABgLACg");
        this.shape.setTransform(888.4, -297.4, 0.72, 0.72);

        this.shape_1 = new cjs.Shape();
        this.shape_1.graphics.f("#FFFFFF").s().p("ABBA9IAAhNQAAgbgYAAQgOAAgJAJQgJAIAAAOIAABJIgSAAIAAhNQABgbgXAAQgQAAgJAMQgHAJgBAKIAABJIgTAAIAAh3IASAAIAAASIABAAQANgUAaAAQAZAAAGAUQANgUAZAAQAoAAABAjIAABWg");
        this.shape_1.setTransform(876.3, -297.5, 0.72, 0.72);

        this.shape_2 = new cjs.Shape();
        this.shape_2.graphics.f("#FFFFFF").s().p("AgeA+IAAh4IASAAIAAAaIABAAQANgeAdACIAAAVQgpAAAAAvIAAA2g");
        this.shape_2.setTransform(866.7, -297.5, 0.72, 0.72);

        this.shape_3 = new cjs.Shape();
        this.shape_3.graphics.f("#FFFFFF").s().p("AAZAsQgPATgaAAQgRAAgLgIQgMgJABgRQgBgSANgJQAJgEAUgEIAagFQAMgEAAgJQAAgUgZAAQgdAAgBAXIgUAAQABgVAPgLQAOgJAVAAQAsAAAAAhIAAA9QAAAIABACQABADAEAAIAHgBIAAAQQgGADgJAAQgRAAAAgTgAAIADIgSADQgZAEAAASQABARAXAAQAQAAAKgJQAJgIAAgKIAAgSQgFABgLACg");
        this.shape_3.setTransform(858.8, -297.4, 0.72, 0.72);

        this.shape_4 = new cjs.Shape();
        this.shape_4.graphics.f("#FFFFFF").s().p("AgqBBQgOgRAAgbQAAgaAOgRQAPgSAaAAQAKAAAJAEQAMAFAHAKIAAAAIAAg/IAUAAIAACmIgUAAIAAgRIAAAAQgKAUgbgBQgbABgPgUgAgbgIQgIAKAAAUQAAATAJAMQAKAOARAAQATAAAJgOQAJgMAAgUQAAgTgJgKQgKgOgTgBQgSAAgJAPg");
        this.shape_4.setTransform(848.7, -299, 0.72, 0.72);

        this.shape_5 = new cjs.Shape();
        this.shape_5.graphics.f("#FFFFFF").s().p("AgxA8IAAgPIBHhXIhDAAIAAgRIBdAAIAAAOIhJBYIBMAAIAAARg");
        this.shape_5.setTransform(839.7, -297.4, 0.72, 0.72);

        this.shape_6 = new cjs.Shape();
        this.shape_6.graphics.f("#FFFFFF").s().p("AAZAsQgQATgZAAQgoAAABgiQAAgSAMgJQAJgEATgEIAbgFQAMgEAAgJQAAgUgZAAQgdAAgBAXIgUAAQAAgVAQgLQANgJAWAAQAsAAAAAhIAAA9QAAAIABACQABADAEAAIAGgBIAAAQQgEADgKAAQgRAAAAgTgAAIADIgSADQgYAEgBASQAAARAYAAQAQAAALgJQAIgIAAgKIAAgSQgFABgLACg");
        this.shape_6.setTransform(826.3, -297.4, 0.72, 0.72);

        this.shape_7 = new cjs.Shape();
        this.shape_7.graphics.f("#FFFFFF").s().p("AgJA8Igth3IAXAAIAgBjIAAAAIAhhjIAVAAIgsB3g");
        this.shape_7.setTransform(817.2, -297.4, 0.72, 0.72);

        this.shape_8 = new cjs.Shape();
        this.shape_8.graphics.f("#FFFFFF").s().p("AAZAsQgPATgZAAQgoAAgBgiQABgSANgJQAIgEAUgEIAagFQAMgEAAgJQAAgUgZAAQgcAAgCAXIgUAAQACgpAxAAQAsAAAAAhIAAA9QAAAIABACQABADAEAAIAHgBIAAAQQgGADgJAAQgQAAgBgTgAAJADIgTADQgYAEAAASQAAARAXAAQAQAAAKgJQAJgIAAgKIAAgSQgFABgKACg");
        this.shape_8.setTransform(808.4, -297.4, 0.72, 0.72);

        this.shape_9 = new cjs.Shape();
        this.shape_9.graphics.f("#FFFFFF").s().p("AgeA+IAAh4IASAAIAAAaIABAAQANgeAdACIAAAVQgpAAAAAvIAAA2g");
        this.shape_9.setTransform(801.2, -297.5, 0.72, 0.72);

        this.shape_10 = new cjs.Shape();
        this.shape_10.graphics.f("#FFFFFF").s().p("Ag4BVIAAimIAUAAIAAAQIABAAQAIgTAcAAQAbAAAPATQAOASAAAbQAAAZgOARQgPATgbAAQgYAAgMgTIgBAAIAAA/gAgdg0QgIAMAAATQAAAUAJAKQAKAOASAAQATAAAJgOQAIgLAAgUQAAgSgJgMQgKgOgRAAQgTAAgKAOg");
        this.shape_10.setTransform(793, -295.8, 0.72, 0.72);

        this.shape_11 = new cjs.Shape();
        this.shape_11.graphics.f("#FFFFFF").s().p("AgqAtQgPgRAAgcQAAgaAPgRQAPgTAbAAQAbAAAQATQAPARAAAaQAAAbgPASQgQASgbAAQgbAAgPgSgAgZggQgLAMAAAUQAAAVALAMQAKAMAPAAQAQAAAKgMQALgMAAgVQAAgUgLgMQgKgMgQAAQgPAAgKAMg");
        this.shape_11.setTransform(782.7, -297.4, 0.72, 0.72);

        this.shape_12 = new cjs.Shape();
        this.shape_12.graphics.f("#FFFFFF").s().p("AgqBBQgOgRAAgbQAAgaAOgRQAPgSAaAAQAaAAAMATIAAAAIAAg/IAUAAIAACmIgUAAIAAgRIAAAAQgJAUgdgBQgaABgPgUgAgbgIQgIAKAAAUQAAATAJAMQAKAOARAAQATAAAJgOQAJgMAAgUQAAgTgJgKQgKgOgTgBQgRAAgKAPg");
        this.shape_12.setTransform(772.4, -299, 0.72, 0.72);

        this.shape_13 = new cjs.Shape();
        this.shape_13.graphics.f("#FFFFFF").s().p("AgGA7IAAg0Ig0AAIAAgOIA0AAIAAgzIANAAIAAAzIA0AAIAAAOIg0AAIAAA0g");
        this.shape_13.setTransform(757.6, -297.3, 0.72, 0.72);

        this.shape_14 = new cjs.Shape();
        this.shape_14.graphics.f("#FFFFFF").s().p("AiDC7IDLl1IA3AAIjLF1gABdCqQgQgGgLgNQgLgMgEgSQgGgRAAgWQAAgVAGgRQAEgRALgNQALgNAQgEQASgIAWABQAXgBAQAIQARAEALANQAKANAGARQAFARAAAVQAAAWgFARQgGASgKAMQgLANgRAGQgQAIgXAAQgWAAgSgIgAB3AkQgEAEgCAIQgDAKAAAYQAAAZADAKQACAIAEAEQAGAFAIAAQAIAAAFgFQAFgEACgIQADgKAAgZQAAgYgDgKQgCgIgFgEQgFgFgIAAQgIAAgGAFgAirAFQgRgGgLgMQgLgNgEgRQgGgSAAgUQAAgWAGgQQAEgTALgMQALgMARgIQAQgGAXgBQAWABARAGQARAIALAMQALAMAEATQAGAQAAAWQAAAUgGASQgFARgKANQgLAMgRAGQgRAGgWAAQgXAAgQgGgAiRiAQgFAEgCAIQgDAKAAAZQAAAYADAKQACAIAFAEQAFAFAIAAQAIAAAGgFQAEgEACgIQADgKAAgYQAAgZgDgKQgCgIgEgEQgGgFgIAAQgIAAgFAFg");
        this.shape_14.setTransform(868, -330.6);

        this.shape_15 = new cjs.Shape();
        this.shape_15.graphics.f("#FFFFFF").s().p("AgxCpQgggQgPgOQgLgLgJgNQgJgPgIgQQgGgSgEgUQgDgWAAgYQAAgXADgWQAEgUAGgSQAIgRAJgOQAJgNALgLQAOgOAhgQQAYgIAZgBQAYABAZAIIAZANQANAHAKAKQALALAJANQAJAOAIARQAGASAEAUQADAWAAAXQAAAYgDAWQgEAUgGASQgIAQgJAPQgJANgLALQgKAKgNAIIgYAMQgZAJgZAAQgYAAgZgJgAgchaQgLAKgFARQgFAOgCATIgBAeQABArAHAVQAGARAKAJQALALARAAQARAAAMgLQAKgJAGgRQAHgVABgrIgBgdQgCgUgFgOQgGgRgKgJQgMgLgRAAQgQAAgMAKg");
        this.shape_15.setTransform(824.4, -330.6);

        this.shape_16 = new cjs.Shape();
        this.shape_16.graphics.f("#FFFFFF").s().p("AABCtIAAhEIiYAAIAAhfICdi2IBjAAIAAC/IAvAAIAABWIgvAAIAABEgAhSATIBTAAIAAhfg");
        this.shape_16.setTransform(789.7, -330.6);

        this.shape_17 = new cjs.Shape();
        this.shape_17.graphics.f("#FFFFFF").s().p("AhNApIAAhQICbAAIAABQg");
        this.shape_17.setTransform(761.4, -326.6);

        this.shape_18 = new cjs.Shape();
        this.shape_18.graphics.f("#FFFFFF").s().p("AgYBWIAAiGIAiAAIAACGgAgZg4IASgdIAhAAIgcAdg");
        this.shape_18.setTransform(847.4, -368.9);

        this.shape_19 = new cjs.Shape();
        this.shape_19.graphics.f("#FFFFFF").s().p("AAWBDIguhSIAAAAIAABSIghAAIAAiGIAkAAIAtBSIABAAIAAhSIAhAAIAACGg");
        this.shape_19.setTransform(834.3, -367);

        this.shape_20 = new cjs.Shape();
        this.shape_20.graphics.f("#FFFFFF").s().p("AgQBDIAAgyIgyhUIAoAAIAaA3IAag3IApAAIgyBUIAAAyg");
        this.shape_20.setTransform(818.6, -367);

        this.shape_21 = new cjs.Shape();
        this.shape_21.graphics.f("#FFFFFF").s().p("AAWBDIguhSIAAAAIAABSIghAAIAAiGIAkAAIAtBSIABAAIAAhSIAhAAIAACGg");
        this.shape_21.setTransform(802.9, -367);

        this.instance = new lib.Path();
        this.instance.setTransform(823.1, -329.4, 0.646, 0.762, 0, 0, 0, 120.1, 72.5);

        this.timeline.addTween(cjs.Tween.get({}).to({state: [{t: this.instance}, {t: this.shape_21}, {t: this.shape_20}, {t: this.shape_19}, {t: this.shape_18}, {t: this.shape_17}, {t: this.shape_16}, {t: this.shape_15}, {t: this.shape_14}, {t: this.shape_13}, {t: this.shape_12}, {t: this.shape_11}, {t: this.shape_10}, {t: this.shape_9}, {t: this.shape_8}, {t: this.shape_7}, {t: this.shape_6}, {t: this.shape_5}, {t: this.shape_4}, {t: this.shape_3}, {t: this.shape_2}, {t: this.shape_1}, {t: this.shape}]}).wait(1));

    }).prototype = p = new cjs.MovieClip();
    p.nominalBounds = new cjs.Rectangle(739.1, -384.7, 168, 110.6);


    (lib.suseni = function (mode, startPosition, loop) {
        this.initialize(mode, startPosition, loop, {});

        // Vrstva 1
        this.instance = new lib.Doplnění5("synched", 0);
        this.instance.setTransform(61.4, 90.1, 1.2, 1.2);
        this.instance.alpha = 0;

        this.timeline.addTween(cjs.Tween.get(this.instance).to({alpha: 1}, 4).to({alpha: 0}, 5).wait(1));

    }).prototype = p = new cjs.MovieClip();
    p.nominalBounds = new cjs.Rectangle(26.3, 51.9, 69.2, 75.7);


    (lib.nasavani = function (mode, startPosition, loop) {
        this.initialize(mode, startPosition, loop, {});

        // Vrstva 1
        this.instance = new lib.Doplnění1("synched", 0);
        this.instance.setTransform(103.4, 106.4, 1.2, 1.2);

        this.timeline.addTween(cjs.Tween.get(this.instance).to({alpha: 0}, 4).to({alpha: 1}, 5).wait(1));

    }).prototype = p = new cjs.MovieClip();
    p.nominalBounds = new cjs.Rectangle(0.1, 37.1, 206.8, 138.6);


    (lib.lesk = function (mode, startPosition, loop) {
        this.initialize(mode, startPosition, loop, {});

        // Vrstva 1
        this.instance = new lib.Path_1();
        this.instance.setTransform(280.6, 126.1, 1.088, 1, 0, 0, 0, 215.5, 68.9);
        this.instance.alpha = 0.531;

        this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

    }).prototype = p = new cjs.MovieClip();
    p.nominalBounds = new cjs.Rectangle(46.1, 57.2, 569.2, 165);


// stage content:
    (lib.LeaderDX2motor0218 = function (mode, startPosition, loop) {
        this.initialize(mode, startPosition, loop, {});

        // megasleva
        this.instance = new lib.xmasbck("synched", 0);
        this.instance.setTransform(150, 679.5, 1, 1, 0, 0, 0, 95, 54.5);
        this.instance._off = true;

        this.timeline.addTween(cjs.Tween.get(this.instance).wait(39).to({_off: false}, 0).to({y: 545.5}, 5).wait(135).to({startPosition: 0}, 0).to({
            x: 150.2,
            y: 679
        }, 5).to({_off: true}, 15).wait(1));

        // duoro txt
        this.instance_1 = new lib.Doplnění8("synched", 0);
        this.instance_1.setTransform(170.5, 49.8);
        this.instance_1.alpha = 0;

        this.timeline.addTween(cjs.Tween.get(this.instance_1).to({alpha: 1}, 5).wait(174).to({startPosition: 0}, 0).to({alpha: 0}, 5).to({_off: true}, 1).wait(15));

        // logo
        this.instance_2 = new lib.logo("synched", 0);
        this.instance_2.setTransform(877.4, 53, 1, 1, 0, 0, 0, 68.4, 19.5);

        this.timeline.addTween(cjs.Tween.get(this.instance_2).wait(184).to({startPosition: 0}, 0).to({
            x: 466.5,
            y: 112.8
        }, 5).to({regY: 19.6, scaleX: 1.5, scaleY: 1.5, y: 116.8}, 5).to({alpha: 0}, 5).wait(1));

        // kufrik txt
        this.instance_3 = new lib.kufriktxt("synched", 0);
        this.instance_3.setTransform(171.7, 122.1, 1, 1, 0, 0, 0, 140.8, 16);
        this.instance_3._off = true;

        this.timeline.addTween(cjs.Tween.get(this.instance_3).wait(139).to({_off: false}, 0).to({y: 52.1}, 5).wait(5).to({startPosition: 0}, 0).to({
            regX: 141.1,
            regY: 16.1,
            scaleX: 1.1,
            scaleY: 1.1,
            y: 44.1
        }, 5).to({
            regX: 140.8,
            regY: 16,
            scaleX: 1,
            scaleY: 1,
            y: 52.1
        }, 5).wait(25).to({y: 71.1}, 0).to({y: 126.1}, 5).wait(11));

        // prach drobky
        this.instance_4 = new lib.drobky("synched", 0);
        this.instance_4.setTransform(701.1, 63.7, 1, 1, 0, 0, 0, 64.5, 28.4);
        this.instance_4.alpha = 0;
        this.instance_4._off = true;

        this.timeline.addTween(cjs.Tween.get(this.instance_4).wait(99).to({_off: false}, 0).to({alpha: 1}, 5).wait(30).to({startPosition: 0}, 0).to({alpha: 0}, 5).wait(61));

        // srst
        this.instance_5 = new lib.bublesrst("synched", 0);
        this.instance_5.setTransform(581, 35.5, 1, 1, 0, 0, 0, 46.2, 29.5);
        this.instance_5.alpha = 0;
        this.instance_5._off = true;

        this.timeline.addTween(cjs.Tween.get(this.instance_5).wait(94).to({_off: false}, 0).to({alpha: 1}, 5).wait(35).to({startPosition: 0}, 0).to({alpha: 0}, 5).wait(61));

        // spina
        this.instance_6 = new lib.spina("synched", 0);
        this.instance_6.setTransform(170.9, 125, 1, 1, 0, 0, 0, 140, 16);
        this.instance_6._off = true;

        this.timeline.addTween(cjs.Tween.get(this.instance_6).wait(84).to({_off: false}, 0).to({y: 70}, 5).wait(20).to({startPosition: 0}, 0).to({
            regY: 16.1,
            scaleX: 1.05,
            scaleY: 1.05,
            x: 170.8,
            y: 70.1
        }, 5).to({
            regY: 16,
            scaleX: 1,
            scaleY: 1,
            x: 170.9,
            y: 70
        }, 5).wait(15).to({startPosition: 0}, 0).to({alpha: 0}, 5).to({_off: true}, 21).wait(40));

        // motor
        this.instance_7 = new lib.Doplnění15("synched", 0);
        this.instance_7.setTransform(579.7, 118.1);
        this.instance_7.alpha = 0;
        this.instance_7._off = true;

        this.instance_8 = new lib.Doplnění16("synched", 0);
        this.instance_8.setTransform(627, 119.1);
        this.instance_8._off = true;

        this.timeline.addTween(cjs.Tween.get(this.instance_7).wait(49).to({_off: false}, 0).to({
            _off: true,
            x: 627,
            y: 119.1,
            alpha: 1
        }, 5).wait(146));
        this.timeline.addTween(cjs.Tween.get(this.instance_8).wait(49).to({_off: false}, 5).wait(30).to({startPosition: 0}, 0).to({alpha: 0}, 5).wait(111));

        // motor txt
        this.instance_9 = new lib.vysusi("synched", 0);
        this.instance_9.setTransform(253.3, 51, 1, 1, 0, 0, 0, 99, 28.6);
        this.instance_9.alpha = 0;
        this.instance_9._off = true;

        this.timeline.addTween(cjs.Tween.get(this.instance_9).wait(49).to({_off: false}, 0).to({
            x: 647.3,
            y: 48.3,
            alpha: 1
        }, 5).wait(5).to({startPosition: 0}, 0).to({scaleX: 1.05, scaleY: 1.05, x: 667.2, y: 42.3}, 5).to({
            scaleX: 1,
            scaleY: 1,
            x: 647.3,
            y: 48.3
        }, 5).wait(5).to({startPosition: 0}, 0).to({alpha: 0}, 5).to({_off: true}, 81).wait(40));

        // suseni
        this.instance_10 = new lib.suseni("synched", 0);
        this.instance_10.setTransform(563.8, 82.7, 1, 1, 0, 0, 0, 28.2, 30.9);
        this.instance_10._off = true;

        this.timeline.addTween(cjs.Tween.get(this.instance_10).wait(15).to({_off: false}, 0).wait(29).to({startPosition: 0}, 0).to({alpha: 0}, 5).to({_off: true}, 111).wait(40));

        // duoro
        this.instance_11 = new lib.Doplnění4("synched", 0);
        this.instance_11.setTransform(898, 175.5);

        this.timeline.addTween(cjs.Tween.get(this.instance_11).to({
            x: 493,
            y: 56.5
        }, 9).wait(40).to({startPosition: 0}, 0).to({
            x: 466,
            y: 34.5
        }, 5).wait(130).to({startPosition: 0}, 0).to({x: 202, y: -128.5}, 5).to({_off: true}, 1).wait(10));

        // chuchvalce
        this.instance_12 = new lib.chuchv("synched", 0);
        this.instance_12.setTransform(606.5, 64, 1, 1, 0, 0, 0, 112.5, 49);
        this.instance_12.alpha = 0;
        this.instance_12._off = true;

        this.timeline.addTween(cjs.Tween.get(this.instance_12).wait(89).to({_off: false}, 0).to({alpha: 1}, 5).wait(40).to({startPosition: 0}, 0).to({
            scaleX: 0.5,
            scaleY: 0.5,
            x: 467.8,
            y: 83.2,
            alpha: 0
        }, 5).wait(61));

        // nasavani
        this.instance_13 = new lib.nasavani("synched", 0);
        this.instance_13.setTransform(502.9, 101, 0.95, 0.95, 0, 0, 0, 105.5, 107.4);
        this.instance_13._off = true;

        this.timeline.addTween(cjs.Tween.get(this.instance_13).wait(9).to({_off: false}, 0).wait(30).to({
            regX: 85.4,
            regY: 56.9,
            x: 483.8,
            y: 53
        }, 0).to({_off: true}, 1).wait(160));

        // lesk
        this.instance_14 = new lib.lesk("synched", 0);
        this.instance_14.setTransform(669, 114.9, 1, 1, 0, 0, 0, 215.5, 68.9);
        this.instance_14.alpha = 0;
        this.instance_14._off = true;

        this.timeline.addTween(cjs.Tween.get(this.instance_14).wait(5).to({_off: false}, 0).to({alpha: 1}, 9).to({_off: true}, 26).wait(160));

        // vysaje vytre
        this.instance_15 = new lib.vysajevytre("synched", 0);
        this.instance_15.setTransform(190.2, 69.3, 1, 1, 0, 0, 0, 158.2, 16.4);
        this.instance_15.alpha = 0;

        this.timeline.addTween(cjs.Tween.get(this.instance_15).to({alpha: 1}, 5).wait(43).to({startPosition: 0}, 0).to({alpha: 0}, 5).to({_off: true}, 1).wait(146));

        // vybava
        this.instance_16 = new lib.Doplnění12("synched", 0);
        this.instance_16.setTransform(642, 50.5);
        this.instance_16.alpha = 0;
        this.instance_16._off = true;

        this.timeline.addTween(cjs.Tween.get(this.instance_16).wait(139).to({_off: false}, 0).to({alpha: 1}, 5).wait(35).to({startPosition: 0}, 0).to({alpha: 0}, 5).to({_off: true}, 15).wait(1));

        // bck1
        this.instance_17 = new lib.ClipGroup();
        this.instance_17.setTransform(454.7, 177.8, 1, 1, 0, 0, 0, 564.9, 368.6);
        this.instance_17.alpha = 0;
        this.instance_17._off = true;

        this.timeline.addTween(cjs.Tween.get(this.instance_17).wait(34).to({_off: false}, 0).to({alpha: 1}, 5).wait(161));

        // bcl2
        this.instance_18 = new lib.bck2("synched", 0);
        this.instance_18.setTransform(465, 58.8, 1, 1, 0, 0, 0, 564.9, 92.8);
        this.instance_18.alpha = 0.691;

        this.timeline.addTween(cjs.Tween.get(this.instance_18).wait(199).to({alpha: 1}, 0).wait(1));

    }).prototype = p = new cjs.MovieClip();
    p.nominalBounds = new cjs.Rectangle(425.1, 75, 1082, 392);

})(lib = lib || {}, images = images || {}, createjs = createjs || {}, ss = ss || {});
var lib, images, createjs, ss;