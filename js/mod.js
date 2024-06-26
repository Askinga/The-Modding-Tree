let modInfo = {
	name: "The MJ Tree",
	id: "abc123",
	author: "Askinga",
	pointsName: "MJs",
	modFiles: ["layers.js", "tree.js"],

	discordName: "",
	discordLink: "",
	initialStartPoints: new Decimal (0), // Used for hard resets and new players
	offlineLimit: 1,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "1.6.0 Very big update",
	name: "A very big update",
}

let changelog = `<h1>Changelog:</h1><br>
	<h3>v1.6.0 Very big update</h3><br>
		- More updates soon! Endgame e23010 MJs.<br>
		- Added more upgrades and 4 more achievements! Added a savebank just in case you lose your progress. Added a second upgrade tree. Added another softcap. Added a extension to MJ Point upgrades. Added a MJ Booster layer cap. and more<br>
                - Check back here for more updates! Full changelog at <a href=https://galaxy.click/updates/355>galaxy.click/updates/355</a>`
  
let winText = `Congratulations! You have reached the end and beaten this game, but for now...`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints(){  
    return new Decimal(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	return true
}

// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints())
		return new Decimal(0)

	let gain = new Decimal(1)
	if (layers.Bo.effect().gte(1)) gain = gain.times(layers.Bo.effect())
        gain = gain.times(buyableEffect('Po', 11))
	if (hasUpgrade('p', 11)) gain = gain.times(2)
	if (hasUpgrade('p', 12)) gain = gain.times(upgradeEffect('p', 12))
	if (hasUpgrade('p', 13)) gain = gain.times(upgradeEffect('p', 13))
	if (hasUpgrade('p', 21)) gain = gain.times(10)
	if (hasUpgrade('p', 22)) gain = gain.times(upgradeEffect('p', 22))
	if (hasUpgrade('p', 24)) gain = gain.times(1000)
	if (hasUpgrade('S', 11)) gain = gain.times(10)
	if (hasUpgrade('S', 14)) gain = gain.pow(1.05)
	if (hasUpgrade('G', 11)) gain = gain.times(1e6)
	if (hasUpgrade('G', 12)) gain = gain.times(upgradeEffect('G', 12))
	if (hasUpgrade('H', 11)) gain = gain.times(1e50)
	if (hasUpgrade('H', 12)) gain = gain.times(1e20)
	if (hasUpgrade('L', 41)) gain = gain.pow(1.01)
	if (hasMilestone('p', 0)) gain = gain.times(4)
	if (hasMilestone('p', 1)) gain = gain.times(15)
	if (hasMilestone('p', 2)) gain = gain.times(250)
        if (hasUpgrade('b', 11)) gain = gain.times(upgradeEffect('b', 11))
	if (hasAchievement('a', 21)) gain = gain.times(1.5)
        if (hasUpgrade('Po', 11)) gain = gain.times(100)
	if (hasUpgrade('UT', 11)) gain = gain.times(1e10)
	if (hasUpgrade('UT', 22)) gain = gain.pow(1.01)
	if (hasUpgrade('UT', 31)) gain = gain.times(1e100)
	if (hasUpgrade('UT', 13)) gain = gain.times(1e200)
	if (hasUpgrade('UT', 24)) gain = gain.pow(1.02)
	if (hasUpgrade('p', 31)) gain = gain.times(1e50)
	if (hasUpgrade('UT', 26)) gain = gain.times(1e150)
	if (hasUpgrade('UT', 33)) gain = gain.times(1e300)
	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [
    "Get e23010 MJs to beat the game!"  
]

// Determines when the game "ends"
function isEndgame() {
	return (player.points.gte("e23010"))
}



// Less important things beyond this point!

// Style for the background, can be a function
var backgroundStyle = {

}

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(3600) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
}
