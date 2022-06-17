import {Component} from 'react'
import './index.css'
import Loader from 'react-loader-spinner'
import VaccinationCoverage from '../VaccinationCoverage'
import VaccinationByAge from '../VaccinationByAge'
import VaccinationByGender from '../VaccinationByGender'

const apiStatusConstants = {
  initial: 'Initial',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class CowinDashboard extends Component {
  state = {
    vaccinationData: [],
    vaccinationAge: [],
    vaccinationGender: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getVaccinationData()
  }

  getVaccinationData = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })

    const apiUrl = 'https://apis.ccbp.in/covid-vaccination-data'
    const options = {
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok === true) {
      const fetchedData = await response.json()
      console.log(fetchedData)
      const updatedData = fetchedData.last_7_days_vaccination.map(vaccine => ({
        vaccineDate: vaccine.vaccine_date,
        dose1: vaccine.dose_1,
        dose2: vaccine.dose_2,
      }))
      console.log(updatedData)
      const ageData = fetchedData.vaccination_by_age.map(eachAge => ({
        age: eachAge.age,
        count: eachAge.count,
      }))
      const genderData = fetchedData.vaccination_by_gender.map(eachGender => ({
        count: eachGender.count,
        gender: eachGender.gender,
      }))
      this.setState({
        vaccinationData: updatedData,
        vaccinationAge: ageData,
        vaccinationGender: genderData,
        apiStatus: apiStatusConstants.success,
      })
    }
    if (response.status === 401) {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  renderPrimeDealsList = () => {
    const {vaccinationData, vaccinationAge, vaccinationGender} = this.state
    return (
      <div>
        <div>
          <img
            src="https://assets.ccbp.in/frontend/react-js/cowin-logo.png"
            alt="website logo"
          />
          <p>Co-WIN</p>
        </div>
        <h1>CoWIN Vaccination in India</h1>
        <VaccinationCoverage vaccine1Data={vaccinationData} />
        <VaccinationByAge vaccineAgeData={vaccinationAge} />
        <VaccinationByGender vaccineGenderData={vaccinationGender} />
      </div>
    )
  }

  renderPrimeDealsFailureView = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png"
        alt="failure view"
        className="register-prime-image"
      />
      <h1>Something went wrong</h1>
    </div>
  )

  renderLoadingView = () => (
    <div testId="loader" className="products-loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  render() {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderPrimeDealsList()
      case apiStatusConstants.failure:
        return this.renderPrimeDealsFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }
}
export default CowinDashboard
