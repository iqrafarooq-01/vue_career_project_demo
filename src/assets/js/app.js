// import Vue from 'vue';

// new Vue({
//     el: '#app',
//     data: {
//         message: 'Hello, Vue!'
//     }
// });


// // resources/assets/js/app.js
// import Vue from 'vue';

// new Vue({
//     el: '#app',
//     data: {
//         message: 'Hello, Vue!'
//     }
// });


import Vue from 'vue';
import axios from 'axios';

Vue.component('job-component', {
    template: `
        <div class="container">
            <h2 class="mt-4" v-if="!showJob">Find a Job You Love!</h2>
            <div class="m-3 d-flex justify-content-between align-items-center" v-if="!showJob">
                <label for="resort-select">Choose your location:</label>
                <select id="resort-select" class="form-control mr-2" v-model="selectedResort">
                    <option value="0">All Location</option>
                    <option value="1">Aspen / Snowmass</option>
                    <option value="2">Boone / Banner Elk</option>
                    <option value="3">Breckenridge</option>
                    <option value="4">Jackson Hole</option>
                    <option value="5">Mammoth</option>
                    <option value="6">Park City</option>
                    <option value="7">South Lake Tahoe</option>
                    <option value="8">Steamboat</option>
                    <option value="9">Telluride</option>
                    <option value="10">Whitefish</option>
                    <option value="11">Whistler</option>
                    <option value="12">Vail / Beaver Creek</option>
                    <option value="13">Winter Park</option>
                </select>
                <button @click="fetchJobs" class="btn btn-primary">Search</button>
            </div>

            <div v-if="!showJob">
                <div v-if="jobs.length > 0">
                    <table class="table table-striped mt-3">
                        <thead>
                            <tr>
                                <th>Job Title</th>
                                <th>Location</th>
                                <th>Employment Type</th>
                                <th>Start Date</th>
                                <th>Action</th>
                                <th>JOB ID</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(job, index) in jobs" :key="index">
                                <td>{{ job.job_title }}</td>
                                <td>{{ job.location }}</td>
                                <td>{{ job.employment_type }}</td>
                                <td>{{ job.start_date }}</td>
                                <td>
                                    <button @click="showJobDetail(job)" class="btn btn-info">View</button>
                                </td>
                                <td>{{ job.id }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div v-else>
                    <p>No jobs available.</p>
                </div>
            </div>

            <div class="card" v-else>

                <div class="card-body">
                    <button @click="goBack" class="btn btn-danger">Back</button>
                    <h2 class="card-title">{{ jobDetail.title }}</h2> <br>
                    <h3><u>Position Summary:</u></h3>
                    <p class="card-text">{{ jobDetail.description }}</p>
                    <hr>

                    <h2>APPLY NOW</h2>
                    <h4>Apply now for any one of the positions above. We're excited to start the conversation and see how you can help us grow! </h4>
                        <p>if you simply want more information, please don't hesitate to contact us through the form.</p>
                    <form @submit="submitApplication">
                        <div class="form-group">
                            <input type="text" class="form-control" v-model="name" placeholder="Name" required>
                        </div>
                        <div class="form-group">
                            <input type="email" class="form-control" v-model="email" placeholder="Email" required>
                        </div>
                        <div class="form-group">
                            <label for="resume">Upload Resume</label>
                            <input type="file" ref="resume" class="form-control-file" accept=".pdf,.doc,.docx" required>
                        </div>
                        <div class="form-group">
                            <textarea class="form-control" v-model="message" placeholder="Message"></textarea>
                        </div>
                        <button type="submit" class="btn btn-primary">Apply</button>
                    </form>
                </div>
            </div>
        </div>`,
    data() {
        return {
            jobs: [],
            selectedResort: '0',
            jobDetail: null,
            showJob: false,
        };
    },
    methods: {
        fetchJobs() {
            if (this.selectedResort === '0') {
                axios.get('http://127.0.0.1:8000/api/careers')
                    .then(response => {
                        this.jobs = response.data.jobs;
                    })
                    .catch(error => {
                        console.error(error);
                    });
            } else {
                axios.get(`http://127.0.0.1:8000/api/careers?resort_id=${this.selectedResort}`)
                    .then(response => {
                        this.jobs = response.data.jobs;
                    })
                    .catch(error => {
                        console.error(error);
                    });
            }
        },
        showJobDetail(job) {
            axios.get(`http://127.0.0.1:8000/api/career-detail/${job.id}`)
                .then(response => {
                    this.jobDetail = response.data.job;
                    this.showJob = true;
                })
                .catch(error => {
                    console.error(error);
                });
        },
        submitApplication() {
            const formData = new FormData();
            formData.append('name', this.name);
            formData.append('email', this.email);
            formData.append('message', this.message);
            formData.append('resort_id', this.jobDetail.id);

            const fileInput = this.$refs.resume;
            formData.append('resume', fileInput.files[0]);

            axios.post('http://127.0.0.1:8000/api/career/applytojob', formData)
                .then(response => {
                    console.log('Application submitted successfully');
                })
                .catch(error => {
                    console.error('Application submission failed:', error);
                });
        },
        goBack() {
            this.showJob = false;
        }
    },
    created() {
        this.fetchJobs();
    }
});

// Create a new Vue instance
const app = new Vue({
    el: '#app'
});
