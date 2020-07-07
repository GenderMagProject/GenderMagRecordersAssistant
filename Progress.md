# Progress Documentation
## WEEK 2: July 6 - July 10
### Issues

* issue [#13](https://github.com/GenderMagProject/GenderMagRecordersAssistant/issues/13) : CSV formatting
    * point of contact: Imani

* issue [#15](../../issues/15) : implement delete action button
    * point of contact: Diana
    - [x] frontend setup: HTML button, js click event listener
    - [x] design doc (how should deleteAction() be implemented? flowchart?)
    - [ ] backend: implement deleteAction()
    - [ ] test
    
* issue [#21](../../issues/21) : add a toggle option to hide or display the GenderMag pop up by clicking on the extension icon
    * point of contact: Annie
    - [ ] figure out how to hide and display pop up
    - [ ] test
 
* issue [#22](../../issues/22) : save and exit from screenshot
    * point of contact: Fatima
    
* issue [#41](../../issues/41) : delete the exit button and the save and exit button from the exit screen
    * point of contact: Annie
    - [x] hide buttons on exit screen
    - [x] test

* issue [#43](../../issues/43) : fix subgoals saving in the wrong place
    * point of contact: Elizabeth
    - [x] investigate what happens when clicking on previous subgoals
    - [x] implement a solution so the subgoalID is correct when saving

### Tasks
- [ ] add mentors as contributors
- [ ] set up a code review system
- [ ] read the style guide: https://google.github.io/styleguide/jsguide.html 
- [ ] add comments to the original repository on issues we worked on 

## WEEK 1: June 29 - July 3
### Issues
#### Completed: [#9](../../issues/9), [#11](../../issues/11), [#19](../../issues/19), [#26](../../issues/26), [#27](../../issues/27)

* issue [#9](../../issues/9) : add cancel button when editing subgoals
    * point of contact: Annie
    - [x] front-end: HTML/CSS button on main pop-up
    - [x] back-end: displays the subgoal information without changing the subgoal name
    - [x] test
    - [x] made code more efficient by creating a function to display subgoal information

* issue [#11](../../issues/11) : subgoals/actions bug
    * point of contact: Elizabeth
    - [x] add subgoals to tree before "save and continue"
    - [x] test
    - [x] fix last action added to every subgoal
    - [x] test
    
* issue [#19](../../issues/19) : add exit without saving button
    * point of contact: Annie
    - [x] front-end: HTML/CSS button on main pop-up
    - [x] allow for download of csv file if user changes his/her mind even after clicking exit without saving
    - [x] test

* issue [#26](../../issues/26) : edit subgoal bug
    * point of contact: Elizabeth
    - [x] hide "save & continue" button after subgoal save (it's confusing)
    - [x] after "edit why text", show a new "submit" button that only changes the text
    - [x] make sure old text is displayed first (instead of blank)
    - [x] make a button to get back to creating actions
 
### Tasks
- [x] make a readme to keep track of issues and progress
- [x] contact owner of github for tips on debugging (set up a call?)
- [x] look up tutorial Chrome Dev Tools
- [x] pick a person as point of contact/be in charge of the issue
- [x] find a specific task for each member
