[//]: # (This readme is best viewed at https://github.com/dschrag/StickFigureEmblem)
# Stick Figure Emblem
By Derek Schrag (dschrag) and Daniel Miller (mill1298), CS 252 Fall 2015 Final Project

A demo of a strategy game based off Nintendo's Fire Emblem series, made in 3D using Three.JS, Javascript, and HTML/CSS.

The web server is powered by Node.js and is running on IBM's Bluemix Web Services. The scores database is hosted on IBM's CloudantDB service.

Models created by <a href="https://dmuenter.weebly.com">Dana Muenter</a>.

Music written by Eric Matyas, from <a href="https://soundimage.org">Sound Image</a>.

Play the game <a href="https://stickfigureemblem.mybluemix.net">here</a>.

Hosted on <a href="https://github.com/dschrag/StickFigureEmblem">GitHub</a>.

## Playing the Game
At present time, only local multiplayer is supported (two people in the same browser).

Each player has 3 units, a Warrior, a Mage, and a Ranger.
Combat is based off of a rock-paper-scissors system.
Warriors do bonus damage to Rangers, Rangers do bonus damage to Mages, and Mages do bonus damage to Warriors.

The first person to kill all three of the other player's units is given the chance to submit their name and score to the database. 
Scores are based off how many units you kill, how many units you have remaining, and how few turns you took to win. Other bonuses can occur, such as unit kill streaks and retribution kills.
