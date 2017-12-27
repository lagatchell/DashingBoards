// Angular
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// Other
import { Observable } from 'rxjs';
import { query } from '@angular/core/src/animation/dsl';
import { Subject } from 'rxjs/Subject';
import { forEach } from '@angular/router/src/utils/collection';

import { SnackBarComponent } from '../shared/snackbar.component';
import { Promise } from 'bluebird';
import { HttpHeaders } from '@angular/common/http';

declare var Asana:any;

@Injectable()
export class DataSourceService {

    private authID = '';
    private authID2 = '';
    private authID3 = '';
    workspaces: any;
    selectedWorkspace: any;

    projects: any;
    projectIds = [];
    projectNames = [];
    projectIdNameKey: any = {};
    backgroundColors = [];
    borderColors = [];

    projectTasks: any = {};
    projectTaskTotals = [];
    projectTaskTotalsByMonth = [];
    filteredProjectTasks = {};

    hasFilters: boolean = false;

    AsanaClient: any = Asana.Client.create().useAccessToken(this.authID3);
    dataSource: any = {
        chartType: '',
        chartOptions: {},
        data: {}
    };

    projectIdTotalKey: any = {};

    // Subjects
    public ds: Subject<any> = new Subject();
    public isLoading: Subject<boolean> = new Subject();
    public loadingItem: Subject<string> = new Subject();

    public totalTasks: Subject<string> = new Subject();
    public projectIdTotalKey$: Subject<any> = new Subject();


    constructor(
        public snackBar: SnackBarComponent,
        public http: HttpClient
    ) {
        this.init();
    }

    init() {
        this.resetAll();
        this.isLoading.next(true);
        this.cacheProjectData()
            .then(() => {
                this.loadingItem.next('Loading Project Data...');
                return this.cacheTaskData();
            })
            .then(() => {
                this.loadingItem.next('');
                return this.setProjectTaskTotals();
            })
            .then(() => {
                this.snackBar.open("Loading complete!");
                this.isLoading.next(false);
            })
            .catch((error) => {
                console.log(error.message);
            });
    }

    resetAll() {
        this.projects = {};
        this.projectIds = [];
        this.projectNames = [];
        this.projectIdNameKey = {};
        this.backgroundColors = [];
        this.borderColors = [];
    
        this.projectTasks = {};
        this.projectTaskTotals = [];
        this.projectTaskTotalsByMonth = [];
        this.filteredProjectTasks = {};
    
        this.hasFilters = false;
    }

    setChartConfig(chartType: string, dateType: string, startDate: string, endDate: string, year?: string){

        this.dataSource.chartType = chartType;

        if (chartType === "line") { 
            startDate = '';
            endDate = '';
        } 
        else {
            year = null;
        }

        this.cacheFilteredProjectTasks(startDate, endDate, dateType, year);

        switch (this.dataSource.chartType) {            
            case 'doughnut':
            case 'pie': 
                this.dataSource.data = {
                    labels: this.projectNames,
                    datasets: [{
                        data: this.projectTaskTotals,
                        backgroundColor: this.backgroundColors,
                        hoverBackgroundColor: this.borderColors
                    }]
                };

                this.dataSource.chartOptions = {
                    title: {
                        display: true,
                        text: 'Task Totals',
                    }
                };
                break;
            case 'line': 
                var dataSets = [];

                for(var i=0, len = this.projectNames.length; i<len; i++)
                {
                    dataSets.push({
                        data: this.projectTaskTotalsByMonth[i],
                        label: this.projectNames[i],
                        fill: false,
                        lineTension: 0.1,
                        backgroundColor: this.backgroundColors[i],
                        borderColor: this.borderColors[i],
                        borderCapStyle: 'butt',
                        borderDash: [],
                        borderDashOffset: 0.0,
                        borderJoinStyle: 'miter',
                        pointBorderColor: this.borderColors[i],
                        pointBackgroundColor: this.borderColors[i],
                        pointBorderWidth: 1,
                        pointHoverRadius: 5,
                        pointHoverBackgroundColor: this.borderColors[i],
                        pointHoverBorderColor: this.borderColors[i],
                        pointHoverBorderWidth: 2,
                        pointRadius: 5,
                        pointHitRadius: 10,
                    });
                }

                this.dataSource.data = {
                    labels: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
                    datasets: dataSets
                };

                this.dataSource.chartOptions = {
                    title: {
                        display: true,
                        text: 'Task Totals by Month',
                    }
                };
                break;
            case 'bar':
                this.dataSource.data = {
                    labels: this.projectNames,
                    datasets: [
                        {
                            label: 'Task Totals',
                            backgroundColor: this.backgroundColors,
                            borderColor: this.borderColors,
                            data: this.projectTaskTotals
                        }
                    ]
                };

                this.dataSource.chartOptions = {
                    title: {
                        display: true,
                        text: 'Task Totals',
                    }
                };
                break;
            case 'polarArea': 
                this.dataSource.data = {
                    datasets: [{
                        data: this.projectTaskTotals,
                        backgroundColor: this.backgroundColors,
                        label: 'Task Totals'
                    }],
                    labels: this.projectNames
                };

                this.dataSource.chartOptions = {
                    title: {
                        display: true,
                        text: 'Task Totals',
                    }
                };
                break;
            case 'radar': 
                this.dataSource.data = {
                    labels: this.projectNames,
                    datasets: [
                        {
                            label: 'Task Totals',
                            backgroundColor: '#e1e1e1',
                            borderColor: '#686868',
                            pointBackgroundColor: this.borderColors,
                            pointBorderColor: this.borderColors,
                            pointHoverBackgroundColor: this.borderColors,
                            pointHoverBorderColor: this.borderColors,
                            data: this.projectTaskTotals,
                            pointRadius: 8,
                            pointHoverRadius: 8
                        }
                    ],
                };

                this.dataSource.chartOptions = {
                    title: {
                        display: true,
                        text: 'Task Totals by Month',
                    }
                };
                break;
        };

        this.projectIdTotalKey$.next(this.projectIdTotalKey);
        this.totalTasks.next(this.sumTaskTotals().toString());
        this.ds.next(this.dataSource);
    }

    getChartDataSource$() {
        return this.ds;
    }

    clearDataSource() {
        this.dataSource = {
            chartType: '',
            chartOptions: {},
            data: {}
        };
        this.totalTasks.next(null);
        this.ds.next(this.dataSource);
    }

    getAllProjects() {
        return this.AsanaClient.users.me()
        .then((user) => {
            this.workspaces = user.workspaces;
            let defaultWorkspaceId = {};
            if (this.selectedWorkspace) {
                defaultWorkspaceId = this.selectedWorkspace.id;
                console.log(defaultWorkspaceId);
            }
            else {
                defaultWorkspaceId = user.workspaces[0].id;
                this.selectedWorkspace = user.workspaces[0];
            }

            var requestParams = {
                workspace: defaultWorkspaceId,
                opt_fields: "id,name,color,created_at"
            };

            return this.AsanaClient.projects.findAll(requestParams);
        })
        .catch(function(error) {
            console.log(error.message);
        });
    }

    getProjectTasksByID(projectID) {      
        return this.AsanaClient.users.me()
        .then((user) => {
            var requestParams = {
                opt_fields: "id,name,created_at,completed_at,due_on,custom_fields"
            }

            return this.AsanaClient.tasks.findByProject(projectID, requestParams);
        })
        .then(function(collection){
            return collection.fetch();
        })
        .then(function(tasks){
            return { 
                projectId: projectID,
                data: tasks
             };
        })
        .catch(function(error) {
            console.log(error.message);
        });
    }

    cacheProjectData() {
        const self = this;
        return new Promise(function(resolve, reject)
        {
            self.getAllProjects()
            .then((result) => {
                self.projects = result.data;

                for(var i=0, len = result.data.length; i < len; i++)
                {
                    self.projectIds.push(result.data[i].id);
                    self.projectNames.push(result.data[i].name);
                    self.projectIdNameKey[result.data[i].id] = result.data[i].name;
                    self.backgroundColors.push(self.getThemeColors(result.data[i].color)[0]);
                    self.borderColors.push(self.getThemeColors(result.data[i].color)[1]);

                    if(i == len-1)
                    {
                        resolve();
                    }
                }
            })
            .catch(function(error){
                console.log(error.message);
            });
        });
    }

    cacheTaskData() {
        const self = this;
        let counter = 0;

        return new Promise((resolve, reject) => {
            for(var i=0, len = self.projectIds.length; i<len; i++)
            {
                this.getProjectTasksByID(this.projectIds[i])
                    .then((result) => {
                        this.projectTasks[result.projectId] = result.data;

                        this.loadingItem.next('Loading ' + this.projectNames[counter] + ' tasks...');

                        counter++;
                        if(counter == len)
                        {
                            resolve();
                        }

                    })
                    .catch(function(error){
                        console.log(error.message);
                    });
            }
        });
    }

    setProjectTaskTotals(projectTasks?) {
        const self = this;

        if(projectTasks == null || typeof(projectTasks) === undefined)
        {
            projectTasks = this.projectTasks;
        } 

        return new Promise((resolve, reject) => {

            function push(index)
            {
                self.projectTaskTotals.push(projectTasks[index].length);
                self.projectIdTotalKey[index] = projectTasks[index].length;
            }
    
            for(var i=0, len = self.projectIds.length; i<len; i++)
            {
                push(self.projectIds[i]);
    
                if(i == len -1)
                {
                    resolve();
                }
            }
        });
    }

    setProjectTaskTotalsByMonth(projectTasks) {
        const self = this;
        for(var i=0, len = this.projectIds.length; i<len; i++)
        {
            push(self.projectIds[i]);
        }

        function push(index)
        {
            self.projectTaskTotalsByMonth.push(projectTasks[index]);
        }
    }

    //#region filters
    filterTasksByDateRange(projectTasks, startDate, endDate, dateType)
    {
        var filteredProjectTasks = [];
        
        // Convert the start and end dates to Date objects
        startDate = new Date(startDate);
        endDate = new Date(endDate);

        // Determine which date type was selected
        switch(dateType)
        {
            default:
            case "created_at":
                // Filter project tasks by the given start and end dates
                for(var i=0, len = projectTasks.length; i < len; i++)
                {
                    if (projectTasks[i].created_at !== "") {
                        var projectDate = new Date(projectTasks[i].created_at)
                        
                        if(projectDate != null && projectDate >= startDate && projectDate <= endDate)
                        {
                            filteredProjectTasks.push(projectTasks[i]);
                        }
                    }
                }

                break;
            case "due_on":
                // Filter project tasks by the given start and end dates
                for(var i=0, len = projectTasks.length; i < len; i++)
                {
                    if (projectTasks[i].due_on !== "") {
                        var projectDate = new Date(projectTasks[i].due_on)

                        if(projectDate != null && projectDate >= startDate && projectDate <= endDate)
                        {
                            filteredProjectTasks.push(projectTasks[i]);
                        }
                    }
                }

                break;
            case "completed_at":
                // Filter project tasks by the given start and end dates
                for(var i=0, len = projectTasks.length; i < len; i++)
                {
                    if (projectTasks[i].completed_at !== "") {
                        var projectDate = new Date(projectTasks[i].completed_at)

                        if(projectDate != null && projectDate >= startDate && projectDate <= endDate)
                        {
                            filteredProjectTasks.push(projectTasks[i]);
                        }
                    }
                }

                break;
        }

        // Return the filteredProjectTasks array
        return filteredProjectTasks;    
    }

    filterTasksByYear(projectTasks, year, dateType)
    { 
        // Initalize array for storing monthly task totals
        var tasksPerMonth = [0,0,0,0,0,0,0,0,0,0,0,0],
            filteredProjectTasks = [];

        // Determine which date type is selected
        switch(dateType)
        {
            default:
            case "created_at":
                // Update monthly task totals
                // Add tasks to filteredProjectTasks array
                for(var i=0, len = projectTasks.length; i < len; i++)
                {
                    var taskDate = new Date(projectTasks[i].created_at);

                    if(taskDate.getFullYear() == year)
                    {
                        tasksPerMonth[taskDate.getMonth()] +=1;
                        filteredProjectTasks.push(projectTasks[i]);
                    }
                }

                break;
            case "due_on":
                // Update monthly task totals
                // Add tasks to filteredProjectTasks array
                for(var i=0, len = projectTasks.length; i < len; i++)
                {
                    var taskDate = new Date(projectTasks[i].due_on);
                    if(taskDate.getFullYear() == year)
                    {
                        tasksPerMonth[taskDate.getMonth()] +=1;
                        filteredProjectTasks.push(projectTasks[i]);
                    }
                }

                break;
            case "completed_at":
                // Update monthly task totals
                // Add tasks to filteredProjectTasks array
                for(var i=0, len = projectTasks.length; i < len; i++)
                {
                    var taskDate = new Date(projectTasks[i].completed_at);
                    if(taskDate.getFullYear() == year)
                    {
                        tasksPerMonth[taskDate.getMonth()] +=1;
                        filteredProjectTasks.push(projectTasks[i]);
                    }
                }

                break;
        }

        // Return: 
        // 1. tasksPerMonth array
        // 2. array of filtered tasks
        return {
            tasksPerMonth: tasksPerMonth,
            taskList: filteredProjectTasks
        };
    }

    cacheFilteredProjectTasks(s, e, t, y?)
    {
        var customFieldLength = 0,
            monthlyTaskBreakDown = {};
        this.hasFilters = false;
        this.projectTaskTotals = [];
        this.filteredProjectTasks = {};
        this.projectTaskTotalsByMonth = [];

        // Get the length of the customFieldValues array
        // Used to determine if any custom field values were set
        //customFieldLength = ac.getCustomFieldValues().length;
        
        // Loop through each task and determine if there are any filters set
        for (var taskList in this.projectTasks)
        {
            if (this.projectTasks.hasOwnProperty(taskList)) 
            {
                // If a start and end date is set
                if(s !== null && s !== "" && e !== null && e !== "")
                {
                    // Filter tasks by the date range and date type
                    this.filteredProjectTasks[taskList] = this.filterTasksByDateRange(this.projectTasks[taskList], s, e, t);
                    
                    // If custom fields are set, filter the tasks again by the custom field values
                    /* if(customFieldLength > 0)
                    {
                        this.filteredProjectTasks[taskList] = this.filterTasksByCustomFields(this.filteredProjectTasks[taskList]);
                    } */

                    // Set the has filters flag
                    this.hasFilters = true;
                }
                // If there are no start and end dates set determine if there are custom field set
                /* else if(customFieldLength > 0)
                {
                    // Filter tasks by custom field values
                    ac.filteredProjectTasks[taskList] = ac.filterTasksByCustomFields(ac.projectTasks[taskList]);

                    // If a year has been set, filter the tasks again by year and date type
                    if(ac.IsNullorUndefined(y) == false)
                    {
                        var tasksByYear = ac.filterTasksByYear(ac.filteredProjectTasks[taskList], y, t);
                        ac.filteredProjectTasks[taskList] = tasksByYear.taskList;
                        monthlyTaskBreakDown[taskList] = tasksByYear.tasksPerMonth;
                    }

                    // Set the has filters flag
                    ac.hasFilters = true;
                } */
                // If no date range or custom fields were set, determine if a year was set
                else if(y !== null && typeof(y) !== undefined)
                {
                    // Filter tasks by year and date range
                    var tasksByYear = this.filterTasksByYear(this.projectTasks[taskList], y, t);
                    this.filteredProjectTasks[taskList] = tasksByYear.taskList;
                    monthlyTaskBreakDown[taskList] = tasksByYear.tasksPerMonth;

                    // Set the has filters flag
                    this.hasFilters = true;
                }
                // If no filters have been set, set the hasFilters flag to false
                else {
                    this.hasFilters = false;
                }
            }
        }

        // If any filters have been set (date range, custom fields, year)
        // Calculate project task totals using the filteredProjectTasks array
        if(this.hasFilters)
        {
            this.setProjectTaskTotals(this.filteredProjectTasks);
            this.setProjectTaskTotalsByMonth(monthlyTaskBreakDown);
        }
        // Else calculate project task totals using the projectTasks array
        else {
            this.setProjectTaskTotals();
        }
    }
    //#endregion

    getThemeColors(asanaColor) {
        var scheme = new Array();

        switch(asanaColor)
        { 
            case null:
                scheme.push("rgba(104, 104, 104, 0.5)");
                scheme.push("rgba(104, 104, 104, 1)");
                break;
            case "none":
                scheme.push("rgba(104, 104, 104, 0.5)");
                scheme.push("rgba(104, 104, 104, 1)");
                break;
            case "dark-red":
                scheme.push("rgba(232,56,79, 0.5)");
                scheme.push("rgba(232,56,79, 1)"); 
                break;
            case "dark-orange":
                scheme.push("rgba(253,97,44, 0.5)");
                scheme.push("rgba(253,97,44, 1)"); 
                break;
            case "light-orange": 
                scheme.push("rgba(253,154,0, 0.5)");
                scheme.push("rgba(253,154,0, 1)");
                break;
            case "light-yellow": 
                scheme.push("rgba(238,195,0, 0.5)");
                scheme.push("rgba(238,195,0, 1)");
                break;
            case "light-green": 
                scheme.push("rgba(164,207,48, 0.5)");
                scheme.push("rgba(164,207,48, 1)");
                break;
            case "dark-green": 
                scheme.push("rgba(98,210,111, 0.5)");
                scheme.push("rgba(98,210,111, 1)");
                break;
            case "light-teal": 
                scheme.push("rgba(55,197,171, 0.5)");
                scheme.push("rgba(55,197,171, 1)");
                break;
            case "dark-teal": 
                scheme.push("rgba(32,170,234, 0.5)");
                scheme.push("rgba(32,170,234, 1)");
                break;
            case "light-blue": 
                scheme.push("rgba(65,134,224, 0.5)");
                scheme.push("rgba(65,134,224, 1)");
                break;
            case "dark-purple": 
                scheme.push("rgba(122,111,240, 0.5)");
                scheme.push("rgba(122,111,240, 1)");
                break;
            case "light-purple":
                scheme.push("rgba(170,98,227, 0.5)");
                scheme.push("rgba(170,98,227, 1)");
                break;
            case "light-pink":
                scheme.push("rgba(227,98,227, 0.5)");
                scheme.push("rgba(227,98,227, 1)");
                break;
            case "dark-pink":
                scheme.push("rgba(234,78,157, 0.5)");
                scheme.push("rgba(234,78,157, 1)"); 
                break;
            case "light-red":
                scheme.push("rgba(252,145,173, 0.5)");
                scheme.push("rgba(252,145,173, 1)");
                break;
            case "light-warm-gray":
                scheme.push("rgba(141,163,166, 0.5)");
                scheme.push("rgba(141,163,166, 1)");
                break;
        }
        
        return scheme;
    }

    sumTaskTotals() {
        let sum = 0;

        for(let i=0, len = this.projectTaskTotals.length; i<len; i++)
        {
            sum += this.projectTaskTotals[i];
        }

        return sum;
    }

    getCachedProjectTasksById(projectID) {

        return new Promise((resolve, reject) => {
            let tasks = (this.hasFilters)? this.filteredProjectTasks[projectID]: this.projectTasks[projectID];
            resolve(tasks);
        });
    }

    //#region Custom Fields
    
    getCustomFields$() {
        return this.http.get(`https://app.asana.com/api/1.0/workspaces/${this.selectedWorkspace.id}/custom_fields`, {
            headers: new HttpHeaders().set('Authorization', "Bearer " + this.authID),
        }).toPromise();
    }


    //#endregion

    //#region Utility Functions
    IsNullorUndefined(item) {
        let isNullorUndefined = false;

        if(typeof(item) == "undefined")
        {
            isNullorUndefined = true;
        }
        else if(item == null)
        {
            isNullorUndefined = true;
        }

        return isNullorUndefined;
    }

    ItemExists(collection, item)
    {
        let exists = false;
    
        for(let i=0, len = collection.length; i< len; i++)
        {
            if(collection[i] == item)
            {
                exists = true;
            }
        }
    
        return exists;
    }
    //#endregion
}