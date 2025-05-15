import React from 'react';
import { LoginPopup, AddTaskPopup, EditTaskPopup } from '../components/PopupConfigs';
import '../styles/index.css';

export default function NoPages() {
const { Component: LoginPopupComponent, trigger: triggerLogin } = LoginPopup();
const { Component: AddTaskPopupComponent, trigger: triggerAddTask} = AddTaskPopup();
const { Component: EditTaskPopupComponent, trigger: triggerEditTask} = EditTaskPopup();

  return (
    <div>
      404 - No Page Found!

      <br />
      <br />


      <button className="button" onClick={triggerLogin}>
        Open Login Pop-Up
      </button>
      <LoginPopupComponent />


      <br />
      <br />


      <button className="button" onClick={triggerAddTask}>
        Open AddTask Pop-Up
      </button>

      <AddTaskPopupComponent />


            <br />
      <br />


      <button className="button" onClick={triggerEditTask}>
        Open EditTask Pop-Up
      </button>

      <EditTaskPopupComponent />
    </div>

    
  );
}