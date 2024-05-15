addLayer("p", {
    name: "MJ points", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "MJ", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    nodeStyle: {
	"border-radius": "10% / 10%",
	"width": "125px",
	"height": "125px"
    },
    color: "#05199c",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "MJ points", // Name of prestige currency
    baseResource: "MJs", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    passiveGeneration() {
        if (hasUpgrade('B', 11)) return 10
	if (hasMilestone('S', 0)) return 1
	return 0
    },
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if (hasUpgrade('S', 11)) mult = mult.times(10)
	if (hasUpgrade('S', 12)) mult = mult.times(upgradeEffect('S', 12))
        if (hasUpgrade('S', 13)) mult = mult.times(upgradeEffect('S', 13))
	if (hasUpgrade('S', 23)) mult = mult.pow(1.08)
        if (hasUpgrade('L', 13)) mult = mult.times(1000)
	if (hasUpgrade('p', 23)) mult = mult.times(1.4)
	if (inChallenge('S', 11)) mult = mult.pow(0.3)
	if (hasChallenge('S', 11)) mult = mult.pow(1.1)
	if (inChallenge('G', 11)) mult = mult.pow(0.8)
	if (inChallenge('H', 11)) mult = mult.pow(0.5)
	if (hasUpgrade('G', 11)) mult = mult.times(1000)
	if (hasUpgrade('H', 11)) mult = mult.times(1e20)
	if (hasUpgrade('L', 35)) mult = mult.times(1e25)
	if (hasUpgrade('L', 42)) mult = mult.pow(1.011)
	return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
	return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "m", description: "M: Reset for MJ points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},
    tabFormat: {
        "Main tab": {
            content: [
                "main-display",
                "blank",
                "prestige-button",
                "blank",
                "blank",
                "blank",
                "blank",
                "blank",
                "blank",
                "upgrades"
            ],
        },
        "Milestones": {
            content: [
                ["infobox", "buyable"],
                "main-display",
                "blank",
                "blank",
                "milestones"
            ],
        },
    },
    upgrades: {
        11: {
            title: "MJ Doubler",
            description: "Double your MJ gain.",
            cost: new Decimal(1),
        },
        12: {
            title: "MJ Boost",
            description: "Multiply MJ gain based on MJ points.",
            cost: new Decimal(4),
            effect(){
                let expu3 = 0.5
                let eff = player.p.points.add(1).pow(expu3)
                eff = softcap(eff, new Decimal("1e5000"), 0.5)
                return eff
	    },
            effectDisplay() { // Add formatting to the effect
                let softcapDescription = ""
                let upgEffect = upgradeEffect(this.layer, this.id)
                if (upgEffect.gte(new Decimal("e5000")) ) {
                    softcapDescription = " (Softcapped)"
		}
	        return "This upgrade boosts MJs by " + format(upgEffect)+"x" + softcapDescription
            },
	    unlocked() { return (hasUpgrade('p', 11)) },
        },
        13: {
            title: "MJs boost MJs",
            description: "MJ gain is boosted by MJs.",
            cost: new Decimal(18),
            effect(){
                return player.points.add(1).pow(0.15)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
	    unlocked() { return (hasUpgrade('p', 12)) },
	},
	14: {
            title: "speeding through this layer",
            description: "Unlock Layer 1 Speeders.",
            cost: new Decimal(20),
	    unlocked() { return (hasUpgrade('p', 13)) },
	},
	21: {
            title: "MJ Swarm",
            description: "×10 MJ gain.",
            cost: new Decimal(150),
	    unlocked() { return (hasUpgrade('p', 14)) },
	},
	22: {
            title: "MJ Boost but nerfed",
            description: "Multiply MJ gain based on MJ points with a reduced effect.",
            cost: new Decimal(13000),
            effect(){
                return player[this.layer].points.add(1).pow(0.33)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
            unlocked() { return (hasUpgrade('p', 21)) },
	},
        23: {
            title: "MJ Point Boost to speed up this layer",
            description: "×1.4 MJ Point gain.",
            cost: new Decimal(100000),
	    unlocked() { return (hasUpgrade('p', 22)) },
	},
	24: {
            title: "Last upgrade until the next layer!",
            description: "×1000 MJ gain and unlock a new layer.",
            cost: new Decimal(550000000),
	    unlocked() { return (hasUpgrade('p', 23)) },
	},
    }, 
    milestones: {
        0: {
            requirementDescription: "40 MJ Points",
            effectDescription: "Multiply MJ gain by 4.",
            done() { return player.p.points >= (40) }
        },
        1: {
            requirementDescription: "1,000 MJ Points",
            effectDescription: "Multiply MJ gain by 15.",
            done() { return player.p.points >= (1000) }
        },
        2: {
            requirementDescription: "1,000,000 MJ Points",
            effectDescription: "Multiply MJ gain by 250.",
            done() { return player.p.points >= (1000000) }
        },
    },
    automate() {
            if(hasUpgrade('G', 11) || hasUpgrade('H', 11)) {
                buyUpgrade('p', 11)
                buyUpgrade('p', 12)
                buyUpgrade('p', 13)
                buyUpgrade('p', 14)
                buyUpgrade('p', 21)
                buyUpgrade('p', 22)
                buyUpgrade('p', 23)
                buyUpgrade('p', 24)
        }
    },
})

addLayer("S", {
    name: "Super MJ Points",
    symbol: "SMJ",
    position: 0,
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    nodeStyle: {
	"border-radius": "100%",
	"width": "120px",
	"height": "100px"
    },
    color: "#0ec466",
    requires: new Decimal(1e11), // Can be a function that takes requirement increases into account
    resource: "Super MJ Points", // Name of prestige currency
    baseResource: "MJ Points", // Name of resource prestige is based on
    baseAmount() {return player.p.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.1425, // Prestige currency exponent
    passiveGeneration() {
        if (hasUpgrade('B', 11)) return 2
	if (hasUpgrade('L', 15)) return 1
	if (hasUpgrade('S', 15)) return 0.075
	return 0
    },
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
	if (hasUpgrade('S', 21)) mult = mult.times(10)
	if (hasUpgrade('S', 22)) mult = mult.times(upgradeEffect('S', 22))
	if (hasMilestone('S', 1)) mult = mult.times(10)
	if (hasMilestone('S', 2)) mult = mult.times(20)
	if (inChallenge('G', 11)) mult = mult.pow(0.8)
	if (inChallenge('H', 11)) mult = mult.pow(0.5)
	if (hasChallenge('G', 11)) mult = mult.pow(1.05)
	if (hasUpgrade('G', 11)) mult = mult.times(10)
	if (hasUpgrade('G', 13)) mult = mult.times(25)
	if (hasMilestone('C', 0)) mult = mult.times(5)
	if (hasUpgrade('G', 14)) mult = mult.times(100)
	if (hasUpgrade('H', 11)) mult = mult.times(1e6)
	if (hasUpgrade('L', 34)) mult = mult.times(1e10)
	if (hasUpgrade('L', 43)) mult = mult.pow(1.012)
	if (hasUpgrade('L', 55)) mult = mult.times(upgradeEffect('L', 55))
	if (hasAchievement('a', 64)) mult = mult.times(2)
	return mult
    },



    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "s", description: "S: Reset for Super MJ Points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],

    layerShown(){
        let visible = false
        if (hasUpgrade('p', 24) || player.S.unlocked) visible = true
       return visible
    },
    branches:["p"],
    tabFormat: {
        "Main tab": {
            content: [
                "main-display",
                "blank",
                "prestige-button",
                "blank",
                "blank",
                "blank",
                "blank",
                "blank",
                "blank",
                "upgrades"
            ],
        },
        "Milestones": {
            content: [
                ["infobox", "buyable"],
                "main-display",
                "blank",
                "blank",
                "milestones"
            ],
        },
        "Challenges": {
            content: [
                ["infobox", "buyable"],
                "main-display",
                "blank",
                "blank",
                "challenges"
            ],
        },
    },
    upgrades: {
        11: {
            title: "SUPER MJ?",
            description: "×10 MJ & MJ Point Gain.",
            cost: new Decimal(1),
	},
        12: {
            title: "You need more MJs? Then here you go!",
            description: "Multiply MJ Point gain based on MJs.",
            cost: new Decimal(3),
            effect(){
                return player.points.add(1).pow(0.08)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
	    unlocked() { return (hasUpgrade('S', 11)) },
	},
        13: { 
	    title: "Super MJ Boost",
            description: "Multiply MJ Point gain based on Super MJ points.",
            cost: new Decimal(10),
            effect(){
                return player[this.layer].points.add(2).pow(1.33)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
            unlocked() { return (hasUpgrade('S', 12)) },
	},
        14: { 
	    title: "YEEEEEES!!!",
            description: "^1.05 MJ Gain.",
            cost: new Decimal(250),
	    unlocked() { return (hasChallenge('S', 11)) },
	},
        15: { 
	    title: "Passive Generation",
            description: "Gain 7.5% of Super MJ Points per second.",
            cost: new Decimal(2000),
	    unlocked() { return (hasUpgrade('S', 14)) },
	},
        21: { 
	    title: "BIG BOOST",
            description: "×10 Super MJ Point Gain.",
            cost: new Decimal(250000),
	    unlocked() { return (hasUpgrade('S', 15)) },
	},
        22: {
            title: "BIG LAYER 2 BOOST!",
            description: "Multiply Super MJ Point gain based on MJs.",
            cost: new Decimal(2.5e7),
            effect(){
                return player.points.add(1).pow(0.035)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
	    unlocked() { return (hasUpgrade('S', 21)) },
	},
        23: {
            title: "Almost as strong as the challenge",
            description: "^1.08 MJ Point gain.",
            cost: new Decimal(1e12),
	    unlocked() { return (hasUpgrade('S', 22)) },
	},
        24: {
            title: "A scaling layer",
            description: "Unlock Scaler MJs.",
            cost: new Decimal(1e100),
	    unlocked() { return (hasUpgrade('S', 23)) },
	},
    },
    milestones: {
        0: {
            requirementDescription: "100 Super MJ Points",
            effectDescription: "Passively gain 100% of MJ Points per second!",
            done() { return player.S.points >= (100) }
        },
        1: {
            requirementDescription: "10000 Super MJ Points",
            effectDescription: "×10 Super MJ Point gain",
            done() { return player.S.points >= (10000) }
        },
        2: {
            requirementDescription: "2e14 Super MJ Points",
            effectDescription: "×20 Super MJ Point gain and unlock a new layer",
            done() { return player.S.points >= (2e14) }
        },
    },
    challenges: {
        11: {
            name: "Super MJ Challenge",
            challengeDescription: "^0.3 MJ Points",
            canComplete: function() {return player.points.gte("1e34")},
            goalDescription: "Get e34 MJs.",
            rewardDescription: "^1.1 MJ Points and unlock a new upgrade"
        },
    },
    automate() {
            if(hasUpgrade('H', 11)) {
                buyUpgrade('S', 11)
                buyUpgrade('S', 12)
                buyUpgrade('S', 13)
                buyUpgrade('S', 14)
                buyUpgrade('S', 15)
                buyUpgrade('S', 21)
                buyUpgrade('S', 22)
                buyUpgrade('S', 23)
                buyUpgrade('S', 24)
	}
    },
})

addLayer("C", {
    name: "Scaler MJs",
    symbol: "SC",
    position: 1,
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    nodeStyle: {
	"border-radius": "20% / 10%",
	"width": "125px",
	"height": "125px"
    },
    image: "data:image/png;base64,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",
    color: "#9c5005",
    requires: new Decimal(1e130), // Can be a function that takes requirement increases into account
    resource: "Scaler MJs", // Name of prestige currency
    baseResource: "Super MJ Points", // Name of resource prestige is based on
    baseAmount() {return player.S.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 2.15, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
	return mult
    },



    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row
    displayRow: 1,
    hotkeys: [
        {key: "a", description: "A: Reset for Scaler MJs", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],

    layerShown(){
        let visible = false
        if (hasUpgrade('S', 24) || player.C.unlocked) visible = true
       return visible
     },
    branches:["S"],
    tabFormat: {
        "Main tab": {
            content: [
                "main-display",
                "blank",
                "prestige-button",
                "blank",
                "blank",
                "blank",
                "blank",
                "blank",
                "blank",
                "upgrades"
            ],
        },
        "Milestones": {
            content: [
                ["infobox", "buyable"],
                "main-display",
                "blank",
                "blank",
                "milestones"
            ],
        },
    },
    upgrades: {
        11: {
            title: "Scaler Boost",
            description: "Multiply Giga MJ Point gain based on Scaler MJs.",
            cost: new Decimal(1),
	    effect(){
                return player.C.points.add(2).pow(1.3)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
	},
        12: {
            title: "MJ Click Boost",
            description: "Multiply MJ Click gain based on Scaler MJs.",
            cost: new Decimal(42),
	    effect(){
                return player.C.points.add(2).pow(0.9)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
	},
    },
    milestones: {
        0: {
            requirementDescription: "3 Scaler MJs",
            effectDescription: "×5 Super MJ Points",
            done() { return player.C.points >= (3) }
	},
        1: {
            requirementDescription: "35 Scaler MJs",
            effectDescription: "×10 Hyper MJ Points!",
            done() { return player.C.points >= (35) }
	},
    },
})

addLayer("G", {
    name: "Giga MJ Points",
    symbol: "GMJ",
    position: 0,
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    nodeStyle: {
	"border-radius": "25% / 10%",
	"width": "100px",
	"height": "125px"
    },
    color: "#fcd303",
    requires: new Decimal(1e25), // Can be a function that takes requirement increases into account
    resource: "Giga MJ Points", // Name of prestige currency
    baseResource: "Super MJ Points", // Name of resource prestige is based on
    baseAmount() {return player.S.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.115, // Prestige currency exponent
    passiveGeneration() {
        if (hasUpgrade('B', 11)) return 1
	if (hasUpgrade('L', 15)) return 0.25
        return 0
    },
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
	if (hasUpgrade('G', 13)) mult = mult.times(5)
	if (hasUpgrade('C', 11)) mult = mult.times(upgradeEffect('C', 11))
	if (hasUpgrade('H', 11)) mult = mult.times(1000)
	if (inChallenge('H', 11)) mult = mult.pow(0.5)
	if (hasChallenge('H', 11)) mult = mult.pow(1.1)
	if (hasUpgrade('L', 44)) mult = mult.pow(1.013)
	if (hasUpgrade('L', 32)) mult = mult.times(1e6)
	if (hasUpgrade('B', 15)) mult = mult.times(upgradeEffect('B', 15))
	if (hasAchievement('a', 35)) mult = mult.times(1.2)
	if (hasUpgrade('G', 15)) mult = mult.pow(upgradeEffect('G', 15))
	return mult
    },



    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 2, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "g", description: "G: Reset for Giga MJ Points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],

    layerShown(){
        let visible = false
        if (hasMilestone('S', 2) || player.G.unlocked) visible = true
       return visible
     },
    branches: ["S", "C"],
    tabFormat: {
        "Main tab": {
            content: [
                "main-display",
                "blank",
                "prestige-button",
                "blank",
                "blank",
                "blank",
                "blank",
                "blank",
                "blank",
                "upgrades"
            ],
        },
        "Challenges": {
            content: [
                ["infobox", "buyable"],
                "main-display",
                "blank",
                "blank",
                "challenges"
            ],
        },
    },
    upgrades: {
        11: {
            title: "This is OP!?",
            description: "×1M MJs, ×1000 MJ Points and ×10 Super MJ Points and automate MJ upgrades.",
            cost: new Decimal(1),
	},
        12: {
            title: "MJs boost MJs but nerfed",
            description: "MJ gain is boosted by MJs but nerfed.",
            cost: new Decimal(50),
            effect(){
                return player.points.add(1).pow(0.08)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
	    unlocked() { return (hasUpgrade('G', 11)) },
	},
        13: {
	    title: "Double Layer Boost",
            description: "×5 Giga MJ Points and ×25 Super MJ Points.",
            cost: new Decimal(350),
	    unlocked() { return (hasUpgrade('G', 12)) },
	},
        14: {
            title: "×100 Boost to Super MJ Points and unlock Hyper MJs",
            description: "Exactly what the title says.",
            cost: new Decimal(2e16),
	    unlocked() { return (hasChallenge('G', 11)) },
	},
        15: {
            title: "Giga MJ Power",
            description: "Raise Giga MJ point gain based on MJs.",
            cost: new Decimal(1e308),
            effect(){
                return player.points.add(1).pow(0.000004)
            },
            effectDisplay() { return "^"+format(upgradeEffect(this.layer, this.id))}, // Add formatting to the effect
	    unlocked() { return (hasUpgrade('G', 14)) },
	},
    },
    challenges: {
        11: {
            name: "Exponential Downgrade",
            challengeDescription: "^0.8 all layers except Scaler MJs and this layer.",
            canComplete: function() {return player.points.gte("1e175")},
            goalDescription: "Get e175 MJs.",
            rewardDescription: "^1.05 Super MJ Points and unlocka upgrade"
	},
    },
    automate() {
            if(hasUpgrade('B', 11)) {
                buyUpgrade('G', 11)
                buyUpgrade('G', 12)
                buyUpgrade('G', 13)
                buyUpgrade('G', 14)
	        buyUpgrade('G', 15)
	}
    },
})

addLayer("H", {
    name: "Hyper MJ Points",
    symbol: "HMJ",
    position: 0,
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "#ffffff",
    requires: new Decimal(4e17), // Can be a function that takes requirement increases into account
    resource: "Hyper MJ Points", // Name of prestige currency
    baseResource: "Giga MJ Points", // Name of resource prestige is based on
    baseAmount() {return player.G.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.045, // Prestige currency exponent
    passiveGeneration() {
        if (hasUpgrade('B', 11)) return 0.5
	if (hasUpgrade('L', 15)) return 0.1
        return 0
    },
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
	if (hasMilestone('C', 1)) mult = mult.times(10)
	if (hasUpgrade('L', 13)) mult = mult.times(3)
	if (hasUpgrade('L', 22)) mult = mult.times(upgradeEffect('L', 22))
	if (hasUpgrade('L', 32)) mult = mult.times(20)
	if (hasUpgrade('B', 11)) mult = mult.times(upgradeEffect('B', 11))
	if (hasUpgrade('B', 14)) mult = mult.times(300)
	if (hasUpgrade('B', 13)) mult = mult.times(upgradeEffect('B', 13))
	if (hasUpgrade('Ge', 23)) mult = mult.times(upgradeEffect('Ge', 23))
	if (hasUpgrade('Ge', 27)) mult = mult.times(0.1)
	if (hasAchievement('a', 64)) mult = mult.times(20)
	if (hasAchievement('a', 43)) mult = mult.times(1.1)
	if (hasUpgrade('Ge', 32)) mult = mult.times(1000)
	if (hasUpgrade('H', 13)) mult = mult.times(100)
	if (hasUpgrade('Ge', 35)) mult = mult.times(1e5)
	return mult
    },



    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 3, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "h", description: "H: Reset for Hyper MJ Points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],

    layerShown(){
        let visible = false
        if (hasUpgrade('G', 14) || player.H.unlocked) visible = true
       return visible
     },
    branches: ["G", "C"],
    tabFormat: {
        "Main tab": {
            content: [
                "main-display",
                "blank",
                "prestige-button",
                "blank",
                "blank",
                "blank",
                "blank",
                "blank",
                "blank",
                "upgrades"
            ],
        },
        "Challenges": {
            content: [
                ["infobox", "buyable"],
                "main-display",
                "blank",
                "blank",
                "challenges"
            ],
        },
    },
    upgrades: {
        11: {
            title: "Hyper MJs are SUPER OP!!!!!!!!",
            description: "×1e50 MJs, ×1e20 MJ Points, ×1e6 Super MJ Points and ×1000 Giga MJ Points and automate MJ and Super MJ Upgrades.",
            cost: new Decimal(1),
	},
        12: {
            title: "Important for the challenge",
            description: "×1e10 MJs.",
            cost: new Decimal(1000),
	    unlocked() { return (hasUpgrade('H', 11)) },
	},
        13: {
            title: "GET THAT 13th ULTRA SCALER!",
            description: "×100 Hyper MJ Points.",
            cost: new Decimal(3e80),
            unlocked() { return (hasUpgrade('H', 12)) },
	},
    },
    challenges: {
        11: {
            name: "The hardest challenge in this game",
            challengeDescription: "^0.5 all layers except this layer.",
            canComplete: function() {return player.points.gte("1e550")},
            goalDescription: "Get e550 MJs.",
            rewardDescription: "^1.1 Giga MJ Points and unlock MJ Clicks"
	},
    },
})

addLayer("L", {
    name: "MJ Clicks",
    symbol: "CLI",
    position: 1,
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    nodeStyle: {
	"border-radius": "50% / 10%",
	"width": "60px",
	"height": "100px"
    },
    color: "#911f82",
    requires: new Decimal(10000), // Can be a function that takes requirement increases into account
    resource: "MJ Clicks", // Name of prestige currency
    baseResource: "Hyper MJ Points", // Name of resource prestige is based on
    baseAmount() {return player.H.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.08, // Prestige currency exponent
    passiveGeneration() {
        if (hasUpgrade('B', 11)) return 200
	if (hasUpgrade('L', 54)) return 100
	if (hasUpgrade('L', 23)) return 3
	return 0
    },
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
	if (hasUpgrade('L', 11)) mult = mult.times(3)
	if (hasUpgrade('L', 12)) mult = mult.times(4)
	if (hasUpgrade('L', 13)) mult = mult.times(5)
	if (hasUpgrade('L', 14)) mult = mult.times(upgradeEffect('L', 14))
	if (hasMilestone('L', 0)) mult = mult.times(10)
	if (hasUpgrade('L', 21)) mult = mult.times(4)
        if (hasUpgrade('L', 24)) mult = mult.times(5)
	if (hasMilestone('L', 1)) mult = mult.times(10)
	if (hasMilestone('L', 2)) mult = mult.times(7.5)
	if (hasUpgrade('L', 31)) mult = mult.times(1.5)
	if (hasUpgrade('C', 12)) mult = mult.times(upgradeEffect('C', 12))
	if (hasUpgrade('L', 45)) mult = mult.pow(1.5)
	if (hasUpgrade('L', 51)) mult = mult.times(100)
	if (hasUpgrade('L', 52)) mult = mult.times(1000)
	if (hasUpgrade('L', 53)) mult = mult.times(1e5)
	if (hasUpgrade('L', 55)) mult = mult.times(1e6)
	if (hasUpgrade('B', 12)) mult = mult.times(upgradeEffect('B', 12))
	return mult
    },



    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 3, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "c", description: "C: Reset for MJ Clicks", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],

    layerShown(){
        let visible = false
        if (hasChallenge('H', 11) || player.L.unlocked) visible = true
       return visible
     },
    branches: ["H", "G"],
    tabFormat: {
        "Main tab": {
            content: [
                "main-display",
                "blank",
                "prestige-button",
                "blank",
                "blank",
                "blank",
                "blank",
                "blank",
                "blank",
                "upgrades"
            ],
        },
        "Milestones": {
            content: [
                ["infobox", "buyable"],
                "main-display",
                "blank",
                "blank",
                "milestones"
            ],
        },
    },
    upgrades: {
        11: {
            title: "Clicker in The Modding Tree?",
            description: "×3 MJ Clicks.",
            cost: new Decimal(20),
	},
        12: {
            title: " Clicking Boost",
            description: "×4 MJ Clicks.",
            cost: new Decimal(100),
	},
        13: {
            title: "boost boost boost",
            description: "×5 MJ Clicks, ×3 Hyper MJ Points and ×1000 MJ Points.",
            cost: new Decimal(500),
	},
        14: {
            title: "MOAR CLICKS!",
            description: "Multiply MJ Click gain based on MJ Clicks.",
            cost: new Decimal(10000),
            effect(){
                return player.L.points.add(1).pow(0.225)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
	},
        15: {
            title: "SUPER OP UPGRADE!!",
            description: "Passivley gain 10% of Hyper MJ Point gain per second, 25% of Giga MJ Points per second and 100% of Super MJ Points per second!.",
            cost: new Decimal(5e6),
	},
        21: {
            title: "Click boost!",
            description: "×4 MJ Clicks.",
            cost: new Decimal(6e6),
	},
        22: {
            title: "Even MORE CLICKS!",
            description: "Multiply Hyper MJ Point gain based on MJ Clicks.",
            cost: new Decimal(2e7),
            effect(){
                return player.L.points.add(1).pow(0.4)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
	},
        23: {
            title: "PASSIVE CLICKS",
            description: "Passively gain 300% of MJ Clicks per second!.",
            cost: new Decimal(3e8),
	},
        24: {
            title: "More click boosts!",
            description: "×5 MJ Clicks.",
            cost: new Decimal(4e8),
	},
        25: {
            title: "Milestone!!",
            description: "Get a milestone.",
            cost: new Decimal(3e9),
	},
	31: {
            title: "Little click boost",
            description: "×1.5 MJ Clicks.",
            cost: new Decimal(1e11),
	},
        32: {
            title: "Hyper Boost",
            description: "×20 Hyper MJ Points.",
            cost: new Decimal(2e11),
	},
        33: {
            title: "Giga Boost",
            description: "×1e6 Giga MJ Points.",
            cost: new Decimal(3e11),
	},
        34: {
            title: "Super Boost",
            description: "×1e10 Super MJ Points.",
            cost: new Decimal(5e11),
	},
        35: {
            title: "Normal Boost",
            description: "×1e25 MJ Points.",
            cost: new Decimal(7e11),
	},
        41: {
            title: "The POWER row!!!",
            description: "^1.01 MJs.",
            cost: new Decimal(1e14),
	},
        42: {
            title: "Power 2",
            description: "^1.011 MJ Points.",
            cost: new Decimal(1.5e14),
	},
        43: {
            title: "Power 3",
            description: "^1.012 Super MJ Points.",
            cost: new Decimal(2e14),
	},
        44: {
            title: "Power 4",
            description: "^1.013 Giga MJ Points.",
            cost: new Decimal(2.5e14),
	}, 
        45: {
            title: "SUPER OP!!!",
            description: "^1.5 MJ Clicks.",
            cost: new Decimal(3e14),
	},
        51: {
            title: "Big click boost! Click row",
            description: "×100 MJ Clicks.",
            cost: new Decimal(2e22),
	},
        52: {
            title: "The click row is op!",
            description: "×1000 MJ Clicks.",
            cost: new Decimal(4e25),
	},
        53: {
            title: "Huge click boost",
            description: "×1e5 MJ Clicks.",
            cost: new Decimal(8e29),
	},
        54: {
            title: "More passive gain",
            description: "Now gain 10000% of MJ Click gain per second.",
            cost: new Decimal(5e35),
	},
        55: {
            title: "The last upgrade is this layer",
            description: "×1e6 MJ Clicks and boost Super MJ Point gain based on MJ Clicks and unlock Ultra Scalers.",
            cost: new Decimal(3e37),
	    effect(){
                return player.L.points.add(1).pow(0.3)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
	},
    },
    milestones: {
        0: {
            requirementDescription: "2e5 MJ Clicks",
            effectDescription: "×10 MJ Clicks",
            done() { return player.L.points >= (200000) }
        },
        1: {
            requirementDescription: "3e6 MJ Clicks",
            effectDescription: "×6 MJ Clicks",
            done() { return player.L.points >= (3e6) }
        },
        2: {
            requirementDescription: "Upgrade 25",
            effectDescription: "×7.5 MJ Clicks",
            done() { return (hasUpgrade('L', 25)) }
        },
    },
})

addLayer("a", {
    startData() { return {
        unlocked: true,
    }},
    color: "yellow",
    row: "side",
    layerShown() {return true}, 
    tooltip() { // Optional, tooltip displays when the layer is locked
        return ("Achievements")
    },
    
    achievements: {
        rows: 25,
        cols: 6,
        11: {
            name: "Double!",
            done() { return (hasUpgrade('p', 11)) },
            tooltip: "Get MJ Upgrade 11.",	   
        },
        12: {
            name: "MJ Boost!",
            done() { return (hasUpgrade('p', 12)) },
            tooltip: "Get MJ Upgrade 12.",	   
        },
        13: {
            name: "MJ boosts MJs!!",
            done() { return (hasUpgrade('p', 13)) },
            tooltip: "Get MJ Upgrade 13.",	   
        },
        14: {
            name: "Swarm of MJs",
            done() { return (hasUpgrade('p', 21)) },
            tooltip: "Get MJ Upgrade 21.",	   
        },
        15: {
            name: "The same as MJ upgrade 12 but nerfed",
            done() { return (hasUpgrade('p', 22)) },
            tooltip: "Get MJ Upgrade 22.",	   
        },
        16: {
            name: "About to reset",
            done() { return (hasUpgrade('p', 24)) },
            tooltip: "Get MJ Upgrade 24",	   
        },
        21: {
            name: "SUPER MJ!",
            done() { return player.S.points.gte(1) },
            tooltip: "Get a Super MJ Point. Reward: ×1.5 MJs",
        },
        22: {
            name: "MJs boost MJ Points",
            done() { return (hasUpgrade('S', 12)) },
            tooltip: "Get Super MJ Upgrade 12.",	   
        },
        23: {
            name: "Big MJ Point Boost",
            done() { return (hasUpgrade('S', 13)) },
            tooltip: "Get Super MJ Upgrade 13.",	   
        },
        24: {
            name: "That was a grind",
            done() { return (hasChallenge('S', 11)) },
            tooltip: "Beat the Super MJ Challenge. Reward: ×2 Super MJ Points",	   
        },
        25: {
            name: "EXPONENT!!!",
            done() { return (hasUpgrade('S', 14)) },
            tooltip: "Get Super MJ Upgrade 14.",	   
        },
	26: {
            name: "More grinding, great",
            done() { return (hasUpgrade('S', 15)) },
            tooltip: "Get Super MJ Upgrade 15.",	   
        },
        31: {
            name: "FINALLY!!",
            done() { return (hasUpgrade('S', 23)) },
            tooltip: "Get Super MJ Upgrade 23.",	   
        },
        32: {
            name: "Giga?",
            done() { return player.G.points.gte(1) },
            tooltip: "Reset for a Giga MJ Point.",	   
        }, 	   
        33: {
            name: "You need this!",
            done() { return (hasUpgrade('G', 12)) },
            tooltip: "Get Giga MJ Upgrade 12.",	   
        }, 	
        34: {
            name: "Layer boost",
            done() { return (hasUpgrade('G', 13)) },
            tooltip: "Get Giga MJ Upgrade 13.",	   
        }, 
        35: {
            name: "The challenge is done!",
            done() { return (hasChallenge('G', 11)) },
            tooltip: "Beat Exponential Downgrade. Reward: ×1.2 Giga MJ Points",	   
        }, 
        36: {
            name: "Hyper is coming!!",
            done() { return (hasUpgrade('G', 14)) },
            tooltip: "Get Giga MJ Upgrade 14.",	   
        }, 
        41: {
            name: "HYPER!!!",
            done() { return player.H.points.gte(1) },
            tooltip: "Get a Hyper MJ Point",	   
        }, 
        42: {
            name: "Challenge soon!",
            done() { return (hasUpgrade('H', 12)) },
            tooltip: "Get Hyper MJ Upgrade 12.",	   
        }, 
        43: {
            name: "Hyper is done!?",
            done() { return (hasChallenge('H', 11)) },
            tooltip: "Beat the Hyper MJ Challenge. Reward: ×1.1 Hyper MJ Points",	   
        }, 
        44: {
            name: "Clicker?",
            done() { return player.L.points.gte(1) },
            tooltip: "Get a MJ Click.",	   
        }, 
        45: {
            name: "Layer boost 2",
            done() { return (hasUpgrade('L', 13)) },
            tooltip: "Get MJ Click Upgrade 13.",	   
        }, 
        46: {
            name: "OP UPGRADE",
            done() { return (hasUpgrade('L', 15)) },
            tooltip: "Get MJ Click Upgrade 15.",	   
        }, 
        51: {
            name: "Passive Clicks",
            done() { return (hasUpgrade('L', 23)) },
            tooltip: "Get MJ Click Upgrade 23.",	   
        }, 
        52: {
            name: "More powers!",
            done() { return (hasUpgrade('L', 41)) },
            tooltip: "Get MJ Click Upgrade 41.",	   
        }, 
        53: {
            name: "Big power boost",
            done() { return (hasUpgrade('L', 42)) },
            tooltip: "Get MJ Click Upgrade 42.",	   
        }, 
        54: {
            name: "Super MJ Power Boost. Finally!!!",
            done() { return (hasUpgrade('L', 43)) },
            tooltip: "Get MJ Click Upgrade 43.",	   
        }, 
        55: {
            name: "MJ Click Power Boost",
            done() { return (hasUpgrade('L', 45)) },
            tooltip: "Get MJ Click Upgrade 45.",	   
        }, 
        56: {
            name: "The last upgrade in the click layer",
            done() { return (hasUpgrade('L', 55)) },
            tooltip: "Get MJ Click Upgrade 55.",	   
        }, 
        61: {
            name: "The ULTRA SCALER layer",
            done() { return (hasUpgrade('B', 11)) },
            tooltip: "Get Ultra Scaler Upgrade 11.",	   
        },
        62: {
            name: "MJ Click Swarm",
            done() { return (hasUpgrade('B', 12)) },
            tooltip: "Get Ultra Scaler Upgrade 12.",	   
        },
        63: {
            name: "The last upgrade in this layer",
            done() { return (hasUpgrade('B', 15)) },
            tooltip: "Get Ultra Scaler Upgrade 15.",	   
        },
        64: {
            name: "Generator MJs!",
            done() { return player.Ge.points.gte(1) },
            tooltip: "Get a Generator MJ. Reward: ×20 Hyper MJ Points",	
        },
        65: {
            name: "The grind of generator MJs",
            done() { return player.Ge.points.gte(10000) },
            tooltip: "Get 10000 Generator MJs",	   
        }, 
        66: {
            name: "The overpowered Hyper boost",
            done() { return (hasUpgrade('Ge', 23)) },
            tooltip: "Get Generatir MJ Upgrade 23",	   
        }, 
	71: {
            name: "The generator speed up",
            done() { return (hasUpgrade('Ge', 24)) },
            tooltip: "Get Generator MJ Upgrade 24",	   
        }, 
	72: {
            name: "1M Generator MJs!",
            done() { return player.Ge.points.gte(1000000) },
            tooltip: "Get 1000000 Generator MJs",	   
        }, 
	73: {
            name: "A long wait",
            done() { return player.Ge.points.gte(4e6) },
            tooltip: "Get 4e6 Generator MJs",	   
        }, 
	74: {
            name: "Almost there",
            done() { return player.Ge.points.gte(1.75e7) },
            tooltip: "Get 1.75e7 Generator MJs",	   
        }, 
	75: {
            name: "FINALLY!!!",
            done() { return (hasUpgrade('Ge', 26)) },
            tooltip: "Get Generator MJ Upgrade 26",	   
        }, 
	76: {
            name: "1e9 Generator MJs",
            done() { return player.Ge.points.gte(1e9) },
            tooltip: "Get 1e9 Generator MJs",	   
        }, 
        81: {
            name: "BUYABLE!",
            done() { return (hasUpgrade('Ge', 34)) },
            tooltip: "Get Generator MJ Upgrade 34",	   
        }, 
        82: {
            name: "Accelerators!",
            done() { return player.Gb.points.gte(1) },
            tooltip: "Get a Generator Accelerator",	   
        }, 
        83: {
            name: "More Generator MJs",
            done() { return (hasUpgrade('Gb', 11)) },
            tooltip: "Get Generator Accelerator Upgrade 11",	   
        }, 
        84: {
            name: "Stronger buyable",
            done() { return (hasUpgrade('Gb', 12)) },
            tooltip: "Get Generator Accelerator Upgrade 12",	   
        }, 
	85: {
            name: "New layer",
            done() { return (hasUpgrade('Gb', 13)) },
            tooltip: "Get Generator Accelerator Upgrade 13",	   
        }, 
        86: {
            name: "Raising Generator MJs more",
            done() { return player.Gc.points.gte(1) },
            tooltip: "Get a Generator Raiser",	   
        }, 
        91: {
            name: "Stronger raising boost",
            done() { return (hasUpgrade('Gc', 11)) },
            tooltip: "Get Generator Raiser Upgrade 11",	   
        }, 
        92: {
            name: "Stronger buyable 2",
            done() { return (hasUpgrade('Gc', 12)) },
            tooltip: "Get Generator Raiser Upgrade 12",	   
        }, 
},
})

addLayer("b", {
    name: "Layer 1 Speeders",
    symbol: "SPE",
    position: 1,
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "#6bb012",
    requires: new Decimal(100), // Can be a function that takes requirement increases into account
    resource: "Layer 1 Speeders", // Name of prestige currency
    baseResource: "MJs", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1.3, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
	return mult
    },



    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "b", description: "B: Reset for Layer 1 Speeders", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],

    layerShown(){
        let visible = false
        if (hasUpgrade('p', 14) || player.b.unlocked) visible = true
       return visible
     },
    branches:["p"],

    upgrades: {
        11: {
            title: "More MJs!",
            description: "Multiply MJ gain based on Layer 1 Speeders.",
            cost: new Decimal(1),
	    effect(){
                return player.b.points.add(1).pow(0.9)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
	},
    },
})

addLayer("B", {
    name: "Ultra Scalers",
    symbol: "USC",
    position: 0,
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "#570a0a",
    requires: new Decimal(1e38), // Can be a function that takes requirement increases into account
    resource: "Ultra Scalers", // Name of prestige currency
    baseResource: "Hyper MJ Points", // Name of resource prestige is based on
    baseAmount() {return player.H.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 2, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
	return mult
    },



    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 3, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "u", description: "U: Reset for Ultra Scalers", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],

    layerShown(){
        let visible = false
        if (hasUpgrade('L', 55) || player.B.unlocked) visible = true
       return visible
     },
    branches:["L", "H"],
    
    upgrades: {
        11: {
            title: "SUPER OP GENERATION AND INSANE HYPER BOOST!!",
            description: "Multiply Hyper MJ Point gain based on Ultra Scalers and get 1000% of MJ Point gain per second, 200% of Super MJ Points per second, 100% of Giga MJ Points per second, 50% of Hyper MJ Points per second and 20000% of MJ Click gain per second and also automate Giga MJ upgrades!.",
            cost: new Decimal(1),
	    effect(){
                return player.B.points.add(1).pow(4)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
	},
        12: {
            title: "This boost will boost Hyper a lot!!",
            description: "MASSIVLEY boost MJ Click gain based on Ultra Scalers.",
            cost: new Decimal(4),
	    effect(){
                return player.B.points.add(1).pow(10)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
	},
        13: {
            title: "Hyper boosts Hyper",
            description: "Boost Hyper MJ Point gain based on Hyper MJs.",
            cost: new Decimal(6),
	    effect(){
                return player.H.points.add(1).pow(0.075)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
	},
        15: {
            title: "MORE GIGA!!!!!",
            description: "Multiply Giga MJ Point gain based on Giga MJ Points. Also unlock a new layer",
            cost: new Decimal(9),
	    effect(){
                return player.G.points.add(1).pow(0.15)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
	},
        14: {
            title: "Speed up",
            description: "×300 Hyper MJ Points.",
            cost: new Decimal(8),
	},
        16: {
            title: "Unlock something OP",
            description: "Unlock a upgrade in Generator layer.",
            cost: new Decimal(12),
	},
	17: {
            title: "Generator Multi",
            description: "×20 Generator MJs",
            cost: new Decimal(13),
	},
    },
})

addLayer("Ge", {
    name: "Generator MJs",
    symbol: "GEN",
    position: 2,
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "#f542dd",
    requires: new Decimal(9), // Can be a function that takes requirement increases into account
    resource: "Generator MJs", // Name of prestige currency
    baseResource: "Ultra Scalers", // Name of resource prestige is based on
    baseAmount() {return player.B.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1e-6, // Prestige currency exponent
    passiveGeneration() {
	if (hasUpgrade('Ge', 31)) return 500
	if (hasMilestone('Ge', 1)) return 100
	if (hasUpgrade('Ge', 21)) return 30
	if (hasUpgrade('Ge', 17)) return 20
	if (hasUpgrade('Ge', 14)) return 10
	if (hasUpgrade('Ge', 13)) return 5
	if (hasUpgrade('Ge', 12)) return 2
	if (hasUpgrade('Ge', 11)) return 1
	return 0
    },
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
	mult = mult.times(buyableEffect('Ge', 11))
	if (layers.Gb.effect().gte(1)) mult = mult.times(layers.Gb.effect())
	if (layers.Gc.effect().gte(1)) mult = mult.pow(layers.Gc.effect())
	if (hasMilestone('Ge', 0)) mult = mult.times(4)
        if (hasUpgrade('Ge', 15)) mult = mult.times(1.5)
	if (hasUpgrade('Ge', 16)) mult = mult.times(2)
	if (hasUpgrade('Ge', 22)) mult = mult.times(2)
	if (hasUpgrade('Ge', 24)) mult = mult.times(upgradeEffect('Ge', 24))
	if (hasUpgrade('Ge', 25)) mult = mult.times(10)
	if (hasUpgrade('Ge', 26)) mult = mult.times(2)
	if (hasUpgrade('Ge', 26)) mult = mult.times(upgradeEffect('Ge', 26))
	if (hasUpgrade('Ge', 27)) mult = mult.times(7.5)
	if (hasUpgrade('Ge', 31)) mult = mult.pow(1.02)
	if (hasUpgrade('B', 17)) mult = mult.times(20)
	if (hasUpgrade('Gb', 11)) mult = mult.times(10)
	return mult
    },



    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 3, // Row the layer is in on the tree (0 is the first row
    hotkeys: [
        {key: "e", description: "E: Get Generator MJs", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],

    layerShown(){
        let visible = false
        if (hasUpgrade('B', 15) || player.Ge.unlocked) visible = true
       return visible
     },
    branches:["G"],
    tabFormat: {
        "Main tab": {
            content: [
                "main-display",
                "blank",
                "prestige-button",
                "blank",
                "blank",
                "blank",
                "blank",
                "blank",
                "blank",
                "upgrades"
            ],
        },
        "Milestones": {
            content: [
                ["infobox", "blank"],
                "main-display",
                "blank",
                "blank",
                "milestones"
            ],
        },
	"Buyables": {
            content: [
                ["infobox", "buyable"],
                "main-display",
                "blank",
                "blank",
                "buyables"
            ],
        },
    },
    upgrades: {
        11: {
            title: "Start generating generator MJs",
            description: "Get 1 base Generator MJ per second if you have 9 Ultra Scalers",
            cost: new Decimal(1),
	},
        12: {
            title: "More generating MJs",
            description: "Now get 2 base Generator MJs per second",
            cost: new Decimal(10),
	    unlocked() { return (hasUpgrade('Ge', 11)) },
	},
        13: {
            title: "Even more generating MJs",
            description: "Now get 5 base Generator MJs per second!",
            cost: new Decimal(25),
	    unlocked() { return (hasUpgrade('Ge', 12)) },
	},
        14: {
            title: "10 per second?",
            description: "Get 10 base Generator MJs per second!",
            cost: new Decimal(100),
	    unlocked() { return (hasUpgrade('Ge', 13)) },
	},
        15: {
            title: "Generator Boost",
            description: "×1.5 Gernerator MJs",
            cost: new Decimal(1000),
	    unlocked() { return (hasUpgrade('Ge', 14)) },
	},
        16: {
            title: "More boosts",
            description: "×2 Generator MJs",
            cost: new Decimal(1750),
	    unlocked() { return (hasUpgrade('Ge', 15)) },
	},
        17: {
            title: "Increasing the base to 20",
            description: "Base gain is 20 per second",
            cost: new Decimal(4000),
	    unlocked() { return (hasUpgrade('Ge', 16)) },
	},
        21: {
            title: "Now 30 per second",
            description: "Get 30 base Generator MJ per second",
            cost: new Decimal(6000),
	    unlocked() { return (hasUpgrade('Ge', 17)) },
	},
        22: {
            title: "×2 Boost",
            description: "What the title says",
            cost: new Decimal(10000),
	    unlocked() { return (hasUpgrade('Ge', 21)) },
	},
        23: {
            title: "More Hyper",
            description: "Multiply Hyper MJ Point gain based on Generator MJs",
            cost: new Decimal(22500),
	    effect(){
                return player.Ge.points.add(1).pow(0.80)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
	    unlocked() { return (hasUpgrade('Ge', 22)) },
	},
        24: {
            title: "Generation Speed Up",
            description: "Multiply Generator MJs based on Generatir MJs.",
            cost: new Decimal(50000),
	    effect(){
                return player.Ge.points.add(1).pow(0.1)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
	    unlocked() { return (hasUpgrade('Ge', 23)) },
	},
        25: {
            title: "😱😱😱",
            description: "×10 Generator MJs",
            cost: new Decimal(1e6),
	    unlocked() { return (hasUpgrade('Ge', 24)) },
	},
        26: {
            title: "😊😊😊",
            description: "×2 Generator MJs & Boost Generator MJ gain based on Generator MJs again -nerfed-",
            cost: new Decimal(2e7),
	    effect(){
                return player.Ge.points.add(1).pow(0.0750)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
            unlocked() { return (hasUpgrade('Ge', 25)) },
	},
        27: {
            title: "A boost but a nerf",
            description: "×7.5 Generator MJs but /10 Hyper MJ Points.",
            cost: new Decimal(3e8),
	    unlocked() { return (hasUpgrade('Ge', 26)) },
	},
        31: {
            title: "Speed up Generator MJs",
            description: "Base gain 500 per second.",
            cost: new Decimal(1e9),
	    unlocked() { return (hasUpgrade('Ge', 27)) },
	},
	32: {
            title: "Generator Power!",
            description: "^1.02 Generator MJs.",
            cost: new Decimal(4e9),
	    unlocked() { return (hasUpgrade('Ge', 31)) },
	},
        33: {
            title: "Revival",
            description: "×1000 Hyper MJ Points.",
            cost: new Decimal(6e9),
	    unlocked() { return (hasUpgrade('Ge', 32)) },
	},
        34: {
            title: "A BUYABLE!!!",
            description: "Unlock a buyable",
            cost: new Decimal(2e11),
	    unlocked() { return (hasUpgrade('Ge', 33)) },
	},
        35: {
            title: "The OP Upgrade",
            description: "×1e5 Hyper MJ Points and a new layer.",
            cost: new Decimal(1e12),
	    unlocked() { return (hasUpgrade('B', 16)) },
	},
    },
    milestones: {
        0: {
            requirementDescription: "250 Generator MJs",
            effectDescription: "×4 Generator MJs which boosts generation",
            done() { return player.Ge.points >= (250) }
        },
        1: {
            requirementDescription: "250K Generator MJs",
            effectDescription: "Base gain is increased to 100 per second",
            done() { return player.Ge.points >= (250000) }
        },
    },
    buyables: {
        11: {
        title: "Generator MJ Compounder",
        unlocked() { return (hasUpgrade('Ge', 34)) },
        cost(x) {
            let exp2 = 1.1
            return new Decimal(1e11).mul(Decimal.pow(1.2, x)).mul(Decimal.pow(x , Decimal.pow(exp2 , x))).floor()
        },
        display() {
            return "Cost: " + format(tmp[this.layer].buyables[this.id].cost) + " Generator MJs." + "<br>Bought: " + getBuyableAmount(this.layer, this.id) + "<br>Effect: Boost Generator MJ gain by x" + format(buyableEffect(this.layer, this.id))
        },
        canAfford() {
            return player[this.layer].points.gte(this.cost())
        },
        buy() {
            let cost = new Decimal (1)
            player[this.layer].points = player[this.layer].points.sub(this.cost().mul(cost))
            setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
        },
        effect(x) {
            let base1 = new Decimal(1.5)
            let base2 = x
            if (hasUpgrade('Gb', 12)) base2 = x.mul(new Decimal(1.33))
	    if (hasUpgrade('Gc', 12)) base2 = x.mul(new Decimal(1.42))
	    let expo = new Decimal(1.001)
            let eff = base1.pow(Decimal.pow(base2, expo))
            return eff
        },
    },
},
infoboxes: {
        buyable: {
            title: "Generator MJ buyable",
            body() { return "This buyable can give BIG boosts to generator MJ gain and is important for the game!" },
        },
    }, 
})

addLayer("Gb", {
    name: "Generator Accelerators",
    symbol: "Ge⏩",
    position: 0,
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "#00fbff",
    requires: new Decimal(4e14), // Can be a function that takes requirement increases into account
    resource: "Generator Accelerators", // Name of prestige currency
    baseResource: "Generator MJs", // Name of resource prestige is based on
    baseAmount() {return player.Ge.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1.425, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
	return mult
    },



    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 3, // Row the layer is in on the tree (0 is the first row
    displayRow: 5,
    hotkeys: [
        {key: "o", description: "O: Get Generator Accelerators", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],

    layerShown(){
        let visible = false
        if (hasUpgrade('Ge', 35) || player.Gb.unlocked) visible = true
       return visible
     },
    branches:["B"],
    
    upgrades: {
        11: {
            title: "Stronger boost",
            description: "Improve the Generator Accelerator effect to ^2.2 instead of ^2 and ×10 Generator MJs.",
            cost: new Decimal(3),
	},
        12: {
            title: "Buyable improving",
            description: "Improve Generator MJ Compounder effect.",
            cost: new Decimal(4),
	},
        13: {
            title: "It's time to raise generator MJs MORE!",
            description: "Unlock a new layer.",
            cost: new Decimal(5),
	},
    },
    effect(){
    let enpow = 2
    if (hasUpgrade('Gb', 11)) enpow = 2.2
	let eff = player.Gb.points.add(1).pow(enpow)
       return eff
       },
        effectDescription() {
            let desc = "which is boosting Generator MJs by x" + format(tmp[this.layer].effect);
            return desc;
        },
})

addLayer("Gc", {
    name: "Generator Raisers",
    symbol: "Ge^",
    position: 1,
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "#0f6a94",
    requires: new Decimal(7e22), // Can be a function that takes requirement increases into account
    resource: "Generator Raisers", // Name of prestige currency
    baseResource: "Generator MJs", // Name of resource prestige is based on
    baseAmount() {return player.Ge.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1.46, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
	return mult
    },



    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 3, // Row the layer is in on the tree (0 is the first row
    displayRow: 5,
    hotkeys: [
        {key: "r", description: "R: Get Generator Raisers", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],

    layerShown(){
        let visible = false
        if (hasUpgrade('Gb', 13) || player.Gc.unlocked) visible = true
       return visible
     },
    branches:["Ge"],
    
    upgrades: {
        11: {
            title: "Stronger raising",
            description: "Improve the Generator Raiser effect to ^0.029",
            cost: new Decimal(2),
	},
        12: {
            title: "Buyable improving 2",
            description: "Improve Generator MJ Compounder effect again.",
            cost: new Decimal(3),
	},
    },
    effect(){
    let rapow = 0.025
    if (hasUpgrade('Gc', 11)) rapow = 0.029
	let eff = player.Gc.points.add(1).pow(rapow)
       return eff
       },
        effectDescription() {
            let desc = "which is raising Generator MJs by ^" + format(tmp[this.layer].effect);
            return desc;
        },
})
addLayer("Bo", {
    name: "MJ Boosters",
    symbol: "×",
    position: 1,
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#a0a0a0",
    requires: new Decimal(1e308), // Can be a function that takes requirement increases into account
    resource: "MJ Boosters", // Name of prestige currency
    baseResource: "MJs", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.000025, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
	return mult
    },



    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: "side", // Row the layer is in on the tree (0 is the first row, side is the side
    hotkeys: [
        {key: "J", description: "J: Get MJ Boosters", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],

    layerShown(){
        let visible = true
       return visible
     },
    effect(){
    let raipow = 100
	let eff = player.Bo.points.add(1).pow(raipow)
       return eff
       },
        effectDescription() {
            let desc = "which is boosting MJs by x" + format(tmp[this.layer].effect);
            return desc;
        },
})
