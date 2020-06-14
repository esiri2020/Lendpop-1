import React, { Component } from "react";
import clsx from 'clsx';
import Router from 'next/router';
import withStyles from "@material-ui/styles/withStyles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import StepIcon from '@material-ui/core/StepIcon';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import {DropzoneArea} from 'material-ui-dropzone'
import FacebookIcon from '@material-ui/icons/Facebook';
import TwitterIcon from '@material-ui/icons/Twitter';
import InstagramIcon from '@material-ui/icons/Instagram';
import NotificationsActiveIcon from '@material-ui/icons/NotificationsActive';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import SupervisedUserCircleIcon from '@material-ui/icons/SupervisedUserCircle';
import InputAdornment from '@material-ui/core/InputAdornment';
import Back from "./common/Back";
import numeral from "numeral";
import Questions from '../components/questions';
// import Paystack from '../utils/axios.paystack';
import Api from '../utils/axios.service';
import regions from './data/saudi_regions_lite.json';
import indigo from '@material-ui/core/colors/indigo';


const localStorage = require('local-storage')
const backgroundShape = require("../public/images/shape.svg");

numeral.defaultFormat("0,000");


const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.primary["A100"],
    overflow: "hidden",
    backgroundSize: "cover",
    backgroundPosition: "0 400px",
    marginTop: 10,
    padding: '20 0',
    width: "100%"
  },

  grid: {
    margin: 0
  },
  smallContainer: {
    width: "100%"
  },
  bigContainer: {
    width: "100%"
  },
  stepContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  stepGrid: {
    width: "80%"
  },
  backButton: {
    marginRight: theme.spacing(1)
  },
  outlinedButtom: {
    textTransform: "uppercase",
    margin: theme.spacing(1)
  },
  stepper: {
    backgroundColor: "transparent",
    "@media screen and (max-width: 600px)":{
      display: "none"
    }
  },

  title: {
    fontSize: "1rem",
    flexGrow: 0,
    textAlign: 'left',
    color: theme.palette.primary.main
  },

  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
    borderRadius: '10px',
    width: '100%'
  },
  successPaper: {
    backgroundColor: theme.palette.primary.main,
    justifyContent: 'space-around'
  },
  successText: {
    margin: '5px 0'
  },
  formPaper: {
    margin: 0,
  },
  formLabel: {
    padding: 8,
    fontSize: '1.2rem',
    color:theme.palette.primary.main
  },
  formSubLabel: {
    padding: 8,
    fontSize: '1rem',
  },
  formCaption:{
    padding: 8,
    fontSize: '1rem',
  },
  fixedHeight: {
    height: 250,
  },
  topInfo: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 42
  },
  formControl: {
    width: "100%",
      '& .MuiTextField-root': {
        width: "100%"
      },
  },
  selectEmpty: {
    marginTop: theme.spacing(2)
  },
  borderColumn: {
    borderBottom: `1px solid ${theme.palette.grey["100"]}`,
    paddingBottom: 24,
    marginBottom: 24
  },
  buttonProgress: {
    color: theme.palette.primary.main,
    // position: 'absolute',
    // top: '50%',
    // left: '50%',
    // marginTop: -12,
    // marginLeft: -12,
  },
  flexBar: {
    marginTop: 32,
    display: "flex",
    justifyContent: "center",
    alignSelf: "flex-end",
    width: '40%',
    "@media screen and (max-width: 600px)":{
      marginRight: '15px'
    }
  }
});

const CustomStepIcon = withStyles({
  text: {
    display: 'none',
  }
})(StepIcon)


const getSteps = () => {
  return ["INSTRUCTIONS", "PERSONAL INFO", "DEMOGRAPHICS", "ELIGIBILITY", "AGREEMENT", "OTHER INFO", "COMPLETE"];
};

const banks = ['The National Commercial Bank', 'The Saudi British Bank', 'Saudi Investment Bank','alinma bank','Banque Saudi Fransi','Riyad Bank', 'Samba Financial Group (Samba)', 'alawwal bank', 'Al Rajhi Bank', 'Arab National Bank', 'Bank AlBilad', 'Bank AlJazira', 'Gulf International Bank Saudi Aribia (GIB-SA)']

class LoanApplicationForm extends Component {
  state = {
    loading: false,
    activeStep: 0,
    termsChecked: false,
    labelWidth: 0,
    firstName: this.props.firstName,
    lastName: this.props.lastName,
    NationalIdNo: '',
    dob: '',
    email: this.props.email,
    mobile: '',
    address: '',
    region: '',
    gender: '',
    education: '',
    ethnicity:'',
    employeeReference: '',
    employeeNumber: '',
    salary: '',
    questions:'',
    mobileCheck: false,
    addressCheck: false,
    gracePeriod: '',
    hascreditScore: false,
    creditScore: '',
    repaymentPlan: '',
    bankName: '',
    accountNumber: '',
    banks: banks,
    files: []
  };

  componentDidMount() {
    // if (this.source) {
    //       this.source.cancel('Cancel previous request');
    //   }
    // this.source = Paystack.source()
    // Paystack.banks({ cancelToken: this.source.token }).then(response => {
    //   this.setState({banks: response.data.data})
    // }).catch(error => console.log(error))
    const formData = JSON.parse(localStorage('formstate'))
    if (formData){this.setState({...formData})};
  }

  componentDidUpdate() {
    const data = {...this.state}
    delete data.banks
    delete data.files
    delete data.loading
    if(data.activeStep < 4) {
    localStorage('formstate', JSON.stringify(data))}
  }

  componentWillUnmount() {
    // return this.source.cancel('paystack request canceled')
  }

  handleNext = () => {
    this.setState(state => ({
      activeStep: state.activeStep + 1
    }));
  };

  handleBack = () => {
    this.setState(state => ({
      activeStep: state.activeStep - 1
    }));
  };

  handleReset = () => {
    this.setState({
      activeStep: 0
    });
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleTerms = event => {
    this.setState({ [event.target.name]: event.target.checked, loading: false });
  };

  stepActions() {
    if (this.state.activeStep === 4) {
      return "Accept";
    }
    if (this.state.activeStep === 3) {
      return "Submit";
    }
    if (this.state.activeStep === 6) {
      return "Done";
    }
    return "Next";
  }

  goToDashboard = event => {
    this.props.handler()
  };

  getCity = id => {
    return cities.filter(city => {
      return city.region_id === id
    })
  }

  handleSave(files) {
    this.setState({files: files,});
  }

  clear() {
    localStorage.clear()
  }

  submit = event => {
    event.preventDefault()
    this.setState({loading:true})
    const kycForm = {
      first_name: this.state.firstName,
      last_name: this.state.lastName,
      email: this.state.email,
      national_id: this.state.NationalIdNo,
      salary: this.state.salary,
      employee_reference: this.state.employeeReference,
      employee_number: this.state.employeeNumber,
      gender: this.state.gender,
      bank: this.state.bankName,
      mobile: this.state.mobile,
      dob: this.state.dob,
      tenure: this.props.tenure,
      initial_amount: this.props.initialAmount,
      "address": this.state.address,
      "account_number": this.state.accountNumber
    }
    Api.kycUpdate(JSON.stringify(kycForm)).then((response) => {
      console.log(response);
      return response.data.data
    }).then((data) => {
      const apiData = {
        "email": data.email,
        "amount": data.initial_amount,
        "loan_cos": "1",
        "tenure": data.tenure,
      }
      return apiData })
      .then((data) => {
      return Api.loanApplication(JSON.stringify(data))
    }).then((response) => {
      if (this.state.files.length > 0) {
        const formData = new FormData();
        const keys = ["national_id", 'statement', 'contract', 'payslip']
        for (let i=0; i < this.state.files.length; i++) {
          formData.append(
            keys[i], this.state.files[i], this.state.files[i].name
          )
        }
        formData.append('loan_id', response.data.data.id)
        console.log('uploading files...');
        Api.docUpload(formData).then((response)=> {
          return response
        }).catch(error=>{console.log(error.response)})
      } else {
        return response
      }
    })
    .then((response) => {
        this.setState({loading:false})
        this.clear();
        this.handleNext();
    }).catch(error => {
      console.log(error);
      return this.setState({loading:false})
    })
  }

  render() {
    const edulist = ['None', 'Primary', 'Secondary', 'Diploma', 'Bachelors', 'Masters', 'Doctorate'];
    const handleChange = this.handleChange;
    const { classes } = this.props;
    const steps = getSteps();
    const { activeStep, firstName, lastName, gracePeriod, hascreditScore, creditScore,
      NationalIdNo, email, dob, mobile, gender, education, ethnicity, questions,
      address, region, mobileCheck, addressCheck, repaymentPlan, bankName,
      accountNumber, banks, employeeReference, employeeNumber, salary, loading,
    } = this.state;
    const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
    const successPaper = clsx(classes.paper, classes.successPaper);
    const Label = <Typography variant="caption">PLEASE CLICK TO AGREE TO THE TERMS AND CONDITIONS</Typography>
    return (
      <React.Fragment>
        <CssBaseline />
        <div className={classes.root}>
          <Grid container justify="center">
            <Grid item xs={12}
              alignItems="center"
              justify="center"
              container
              className={classes.grid}
            >
              <Grid item xs={12}>
                {/* <Back /> */}
                <div className={classes.stepContainer}>
                  <div className={classes.bigContainer}>
                    <Stepper
                      classes={{ root: classes.stepper }}
                      activeStep={activeStep}
                      alternativeLabel
                    >
                      {steps.map(label => {
                        return (
                          <Step key={label}>
                            <StepLabel StepIconComponent={CustomStepIcon}>{label}</StepLabel>
                          </Step>
                        );
                      })}
                    </Stepper>
                  </div>
                  {activeStep === 0 && (
                    <Grid container spacing={2}>
                      <Grid item sm={12} md={6}>
                        <Paper className={fixedHeightPaper}>
                          <Typography className= {classes.title} variant="subtitle1" >Loan Application Instructions</Typography>
                          <Typography variant="body2">
                            Welcome to the InstaKash application portal {firstName},
                          </Typography>
                          <Typography variant="body2">
                            we will walk you through the easy process as you continue your application.
                          </Typography>
                          <Typography variant="body2">
                            Please have the following documents avalable:
                          </Typography>
                          <ul>
                            <li>Basic information about yourself</li>
                            <li>For personal loans, specify employer, employer refrence number, your current salary </li>
                            <li>A picture of you for your loan profile</li>
                          </ul>
                          <Typography variant="body2">
                            Your application is automatically saved as you go through the process
                          </Typography>
                          <Typography variant="body2">
                            For inquiries please send an email to borrow@InstaKash.com
                          </Typography>
                        </Paper>
                      </Grid>
                      <Grid item sm={12} md={6}>
                        <Paper className={fixedHeightPaper}>
                          <Typography className= {classes.title} variant="subtitle1" >Application requirements</Typography>
                          <Typography variant="body2">
                            The following are specific requirements for applying for POP lending
                          </Typography>
                          <ul>
                            <li>Read instructions</li>
                            <li>Provide all other personal information</li>
                            <li>Employment history </li>
                            <li>BVN </li>
                            <li>Bank details</li>
                            <li>Documents for account statements</li>
                          </ul>

                          <Typography variant="body2">
                            Click next to proceed to the next stage of your InstaKash application
                          </Typography>

                        </Paper>
                        <FormGroup row>
                          <FormControlLabel
                            control={
                              <Checkbox
                                name="termsChecked"
                                checked={this.state.termsChecked}
                                onChange={this.handleTerms}
                                value="check"
                              />
                            }
                            label={Label}
                          />
                        </FormGroup>
                      </Grid>
                    </Grid>
                  )}
                  {activeStep === 1 && (
                    <Paper className={classes.paper} >
                      <Typography className={classes.formLabel} variant="caption">PERSONAL INFORMATION</Typography>
                      <form className={classes.formControl} noValidate autoComplete="off">
                        <Grid container spacing={2} style={{margin: 0, width: '100%'}}>
                          <Grid item xs={12} sm={4}>
                            <TextField
                              fullWidth
                              required
                              name="firstName"
                              id="outlined-required-firstName"
                              label="First Name"
                              variant="outlined"
                              value={firstName}
                              onChange={handleChange}
                              placeholder="Enter Firstname"
                              InputLabelProps={{
                                shrink: true,
                              }}
                            />
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <TextField
                              id="outlined-lastName"
                              label="Last Name"
                              variant="outlined"
                              name="lastName"
                              value={lastName}
                              onChange={handleChange}
                              placeholder="Enter Lastname"
                              InputLabelProps={{
                                shrink: true,
                              }}
                            />
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <TextField
                              id="outlined-nin-input"
                              label="National ID Number"
                              autoComplete="national-id-number"
                              variant="outlined"
                              name="NationalIdNo"
                              value={NationalIdNo}
                              onChange={handleChange}
                              placeholder="Enter National ID Number"
                              InputLabelProps={{
                                shrink: true,
                              }}
                            />
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <TextField
                              id="outlined-dob-input"
                              label="Date of Birth"
                              variant="outlined"
                              type="date"
                              format="dd/mm/yyyy"
                              name="dob"
                              value={dob}
                              onChange={handleChange}
                              InputLabelProps={{
                                shrink: true,
                              }}
                            />
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <TextField
                              id="outlined-email"
                              label="Email Address"
                              type="email"
                              variant="outlined"
                              name="email"
                              value={email}
                              onChange={handleChange}
                              placeholder="Enter Email Address"
                              InputLabelProps={{
                                shrink: true,
                              }}
                            />
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <TextField
                              id="outlined-mobile"
                              label="Mobile Number"
                              type="number"
                              variant="outlined"
                              name="mobile"
                              value={mobile}
                              onChange={handleChange}
                              placeholder="Enter Mobile Number"
                              InputLabelProps={{
                                shrink: true,
                              }}
                            />
                          </Grid>

                          <Grid item xs={12} style={{padding: 0}}>
                            <Grid item xs={12} sm={4} style={{float: "right"}}>
                              <FormGroup row>
                                <FormControlLabel
                                  style={{marginTop: '-15px', marginLeft:0, marginRight:0}}
                                  control={
                                    <Checkbox
                                      name="mobileCheck"
                                      checked={this.state.mobileCheck}
                                      onChange={this.handleTerms}
                                      value="check"
                                    />
                                  }
                                  label={<Typography variant='body2' style={{fontSize: '0.5rem'}}>
                                    By clicking the button you opt in for sms notification
                                    of offerings sms charges apply
                                  </Typography>}
                                />
                              </FormGroup>
                            </Grid>
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <TextField
                              fullWidth
                              required
                              name="employeeReference"
                              id="outlined-employee-reference"
                              label="Employee Reference"
                              variant="outlined"
                              value={employeeReference}
                              onChange={handleChange}
                              placeholder="Enter Employee Reference"
                              InputLabelProps={{
                                  shrink: true,
                              }}
                            />
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <TextField
                              fullWidth
                              required
                              name="employeeNumber"
                              id="outlined-employee-number"
                              label="Employee Number"
                              variant="outlined"
                              value={employeeNumber}
                              onChange={handleChange}
                              placeholder="Enter Employee Number"
                              InputLabelProps={{
                                shrink: true,
                              }}
                            />
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <TextField
                              fullWidth
                              required
                              name="salary"
                              id="outlined-salary"
                              label="Salary"
                              variant="outlined"
                              type="number"
                              value={salary}
                              onChange={handleChange}
                              placeholder="Enter Monthly Salary Amount"
                              InputLabelProps={{
                                shrink: true,
                              }}
                            />
                          </Grid>
                          <Grid item xs={12} sm={8}>
                            <TextField
                              id="outlined-address"
                              label="Physical Address Information"
                              variant="outlined"
                              name="address"
                              value={address}
                              onChange={handleChange}
                              placeholder="Enter your home address, please specify street name or use location finder"
                              InputLabelProps={{
                                shrink: true,
                              }}
                            />
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <TextField
                              required
                              id="outlined-select-region"
                              select
                              label="Current Region"
                              name="region"
                              value={region}
                              onChange={handleChange}
                              variant="outlined"
                              placeholder="Select Region"
                              InputLabelProps={{
                                shrink: true,
                              }}
                            >
                              {regions.map((region) => (
                                <MenuItem key={region.region_id} value={region.region_id}>
                                  <div style={{display:'flex',justifyContent:'space-between',width:'100%'}}>
                                    <div>{region.name_en}</div><div>{region.name_ar}</div>
                                  </div>
                                </MenuItem>
                              ))}
                            </TextField>
                          </Grid>
                          {/* <Grid item xs={12} sm={2}>
                            <TextField
                              disabled={!region ? true : false}
                              id="outlined-select-city"
                              select
                              label="Current City"
                              name="city"
                              value={city}
                              onChange={handleChange}
                              InputLabelProps={{
                            shrink: true,
                              }}
                              variant="outlined"
                            >
                              {region ? (this.getCity(region).map((city) => (
                            <MenuItem key={city.city_id} value={city.city_id}>
                            <div style={{display:'flex',justifyContent:'space-between',width:'100%'}}>
                            <div>{city.name_en}</div><div>{city.name_ar}</div>
                            </div>
                            </MenuItem>
                              ))) : (this.getCity(1).map((city) => (
                            <MenuItem key={city.city_id} value={city.name_en}>
                            <div style={{display:'flex',justifyContent:'space-between',width:'100%'}}>
                            <div>{city.name_en}</div><div>{city.name_ar}</div>
                            </div>
                            </MenuItem>
                              )))}
                            </TextField>
                          </Grid> */}
                          <Grid item xs={12} style={{padding: 0}}>
                            <Grid item xs={12} sm={4} style={{float: "left"}}>
                              <FormGroup row>
                                <FormControlLabel
                                  style={{marginTop: '-15px', marginLeft:0, marginRight:0}}
                                  control={
                                    <Checkbox
                                      name="addressCheck"
                                      checked={this.state.addressCheck}
                                      onChange={this.handleTerms}
                                      value="check"
                                    />
                                  }
                                  label={<Typography variant='body2' style={{fontSize: '0.5rem'}}>
                                    Please indicate if your address has changed in the past
                                    3 years.
                                  </Typography>}
                                />
                              </FormGroup>
                            </Grid>
                          </Grid>
                        </Grid>
                      </form>
                    </Paper>
                     //
                  )}
                  {activeStep === 2 && (
                    <Paper className={classes.paper}>
                      <Typography className={classes.formLabel} variant="caption">DEMOGRAPHICS</Typography>
                      <form className={classes.formControl} noValidate autoComplete="off">
                        <Grid container spacing={2} style={{margin: 0, width: '100%'}}>
                          <Grid item xs={12} sm={4}>
                            <TextField
                              required
                              id="outlined-select-gender"
                              select
                              label="Gender"
                              name="gender"
                              value={gender}
                              onChange={handleChange}
                              variant="outlined"
                              placeholder="Please pick your gender"
                              InputLabelProps={{
                                shrink: true,
                              }}>
                              <MenuItem key='male' value='male'>
                                Male
                              </MenuItem>
                              <MenuItem key='female' value='female'>
                                Female
                              </MenuItem>
                            </TextField>
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <TextField
                              id="outlined-select-education"
                              select
                              label="Education"
                              placeholder="Education"
                              name="education"
                              value={education}
                              onChange={handleChange}
                              InputLabelProps={{
                                shrink: true,
                              }}
                              variant="outlined"
                            >
                              {edulist.map((level) => (
                                <MenuItem key={level} value={level}>
                                  {level}
                                </MenuItem>
                              ))}
                            </TextField>
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <TextField
                              fullWidth
                              required
                              name="ethnicity"
                              id="outlined-ethnicity"
                              label="Ethnicity"
                              variant="outlined"
                              value={ethnicity}
                              onChange={handleChange}
                              placeholder="Enter Ethnicity"
                              InputLabelProps={{
                                shrink: true,
                              }}
                            />
                          </Grid>

                        </Grid>
                      </form>
                      <Questions email={email}/>
                    </Paper>
                  )}
                  {activeStep === 3 && (
                    <Paper className={classes.paper}>
                      <Typography className={classes.formLabel} variant="caption">ELIGIBILITY</Typography>
                      <Paper className={successPaper}>
                        <Typography className={classes.successText} variant='body2'>Congratulations!!</Typography>
                        <Typography className={classes.successText} variant='body2'>You have prequalified for the loan of $3000 your repayment plan would be $55 to $155 over a period of 16 months.</Typography>
                        <Typography className={classes.successText} variant='body2'>Would you like to proceed?</Typography>
                      </Paper>
                      <form className={classes.formControl} noValidate autoComplete="off">
                        <Grid container spacing={2} style={{margin: '20px 0', width: '100%'}}>
                          <Grid item xs={12} sm={4}>
                            <TextField
                              required
                              id="outlined-select-gender"
                              select
                              label="Eligibility for grace period"
                              name="gracePeriod"
                              value={gracePeriod}
                              onChange={handleChange}
                              variant="outlined"
                              InputLabelProps={{
                                shrink: true,
                              }}>
                              <MenuItem key='1 week' value='1 week'>
                                1 Week
                              </MenuItem>
                              <MenuItem key='2 weeks' value='2 weeks'>
                                2 Weeks
                              </MenuItem>
                              <MenuItem key='3 weeks' value='3 weeks'>
                                3 Weeks
                              </MenuItem>
                              <MenuItem key='1 Month' value='1 Month'>
                                1 Month
                              </MenuItem>
                            </TextField>
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <TextField
                              id="outlined-select-education"
                              select
                              label="Do you have a credit score?"
                              name="hascreditScore"
                              value={hascreditScore}
                              onChange={handleChange}
                              InputLabelProps={{
                                shrink: true,
                              }}
                              variant="outlined"
                            >
                              <MenuItem key='1' value={true}>
                                Yes
                              </MenuItem>
                              <MenuItem key='0' value={false}>
                                No
                              </MenuItem>
                            </TextField>
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <TextField
                              fullWidth
                              disabled={!hascreditScore? true : false}
                              name="creditScore"
                              id="outlined-creditScore"
                              label="If yes, please provide your credit score"
                              variant="outlined"
                              value={creditScore}
                              onChange={handleChange}
                              placeholder="Enter Credit Score"
                              InputLabelProps={{
                                shrink: true,
                              }}
                            />
                          </Grid>
                        </Grid>
                        <Typography className={classes.formSubLabel} variant='caption'>
                          DEBIT & RECONCILIATION AUTHORIZATION
                        </Typography>
                        <Grid container spacing={2} style={{margin: '20px 0', width: '100%'}}>
                          <Grid item xs={12} sm={4}>
                            <TextField
                              id="outlined-select-repayment-plan"
                              select
                              label="How would you like to repay your loan?"
                              name="repaymentPlan"
                              value={repaymentPlan}
                              onChange={handleChange}
                              InputLabelProps={{
                                shrink: true,
                              }}
                              variant="outlined"
                            >
                              <MenuItem key='1' value="Bank">
                                Bank
                              </MenuItem>
                              <MenuItem key='0' value="Card">
                                Card
                              </MenuItem>
                            </TextField>
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <TextField
                              id="outlined-select-bank-name"
                              select
                              label="Bank Name"
                              placeholder="Enter Bank Name"
                              name="bankName"
                              value={bankName}
                              onChange={handleChange}
                              InputLabelProps={{
                                shrink: true,
                              }}
                              variant="outlined"
                            >
                              {banks.map((bank, index) => (
                                <MenuItem key={index} value={bank}>
                                  {bank}
                                </MenuItem>
                              ))}
                            </TextField>
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <TextField
                              fullWidth
                              required
                              type="number"
                              name="accountNumber"
                              id="outlined-accountNumber"
                              label="Account Number"
                              variant="outlined"
                              value={accountNumber}
                              onChange={handleChange}
                              placeholder="Enter Account Number"
                              InputLabelProps={{
                                shrink: true,
                              }}
                            />
                          </Grid>
                        </Grid>
                        <Typography className={classes.formSubLabel} variant='caption'>
                          LIST OF DOCUMENTS TO UPLOAD
                        </Typography>
                        <Grid container spacing={2} style={{margin: '20px 0', width: '100%'}}>
                          <Grid item xs={12} sm={4}>
                            <Paper style={{backgroundColor: '#ececec', padding: '8px'}}>
                              <ul>
                                <li>A passport photograph</li>
                                <li>Bank statement</li>
                                <li>Letter of employment</li>
                              </ul>
                            </Paper>
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <DropzoneArea
                              onChange={this.handleSave.bind(this)}
                              filesLimit={4}
                              acceptedFiles={['image/jpeg', 'image/png', 'application/pdf']}
                              showPreviews={true}
                              maxFileSize={5000000}
                            />
                          </Grid>
                        </Grid>
                      </form>
                      <Questions email={email}/>
                    </Paper>
                  )}
                  {activeStep === 4 && (
                    <div className={classes.bigContainer}>
                      <Paper className={classes.paper}>
                        <div style={{ marginBottom: 24 }}>
                          <Typography
                            variant="caption"
                            className={classes.formLabel}
                          >
                            TERMS & CONDITIONS
                          </Typography>
                          <Typography variant="body1" className={classes.formCaption} gutterBottom>
                            Please read through and accept the terms &
                            conditions
                          </Typography>
                        </div>
                        <div
                          style={{
                            height: 330,
                            padding: 16,
                            border: "2px solid #ccc",
                            borderRadius: "3px",
                            overflowY: "scroll"
                          }}
                        >
                          <Typography
                            variant="subtitle1"
                            style={{ fontWeight: "bold" }}
                            gutterBottom
                          >
                            1. Your agreement
                          </Typography>
                          <Typography variant="body1" gutterBottom>
                            By using this Site, you agree to be bound by, and to
                            comply with, these Terms and Conditions. If you do
                            not agree to these Terms and Conditions, please do
                            not use this site. PLEASE NOTE: We reserve the
                            right, at our sole discretion, to change, modify or
                            otherwise alter these Terms and Conditions at any
                            time. Unless otherwise indicated, amendments will
                            become effective immediately. Please review these
                            Terms and Conditions periodically. Your continued
                            use of the Site following the posting of changes
                            and/or modifications will constitute your acceptance
                            of the revised Terms and Conditions and the
                            reasonableness of these standards for notice of
                            changes. For your information, this page was last
                            updated as of the date at the top of these terms and
                            conditions.
                          </Typography>
                          <Typography
                            variant="subtitle1"
                            style={{ fontWeight: "bold" }}
                            gutterBottom
                          >
                            2. Privacy
                          </Typography>
                          <Typography variant="body1" gutterBottom>
                            Please review our Privacy Policy, which also governs
                            your visit to this Site, to understand our
                            practices. By using this Site, you agree to be bound
                            by, and to comply with, these Terms and Conditions.
                            If you do not agree to these Terms and Conditions,
                            please do not use this site. PLEASE NOTE: We reserve
                            the right, at our sole discretion, to change, modify
                            or otherwise alter these Terms and Conditions at any
                            time. Unless otherwise indicated, amendments will
                            become effective immediately. Please review these
                            Terms and Conditions periodically. Your continued
                            use of the Site following the posting of changes
                            and/or modifications will constitute your acceptance
                            of the revised Terms and Conditions and the
                            reasonableness of these standards for notice of
                            changes. For your information, this page was last
                            updated as of the date at the top of these terms and
                            conditions.
                          </Typography>
                        </div>
                        <FormGroup row>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={this.state.termsChecked}
                                onChange={this.handleTerms}
                                value="check"
                              />
                            }
                            label="I have read and understood the terms & conditions"
                          />
                        </FormGroup>
                      </Paper>
                    </div>
                  )}
                  {activeStep === 5  && (
                    <Paper className={classes.paper} >
                      <Typography variant="body1" className={classes.formCaption} gutterBottom>
                        You're one step closer to completing your loan application, <br/>
                        Instakash would like to get your personal social media details and 5 of your close contacts information.
                      </Typography>
                      <Typography className={classes.formLabel} variant="caption">SOCIAL MEDIA HANDLE</Typography>
                      <form className={classes.formControl} noValidate autoComplete="off">
                        <Grid container spacing={2} style={{margin: 0, width: '100%'}}>
                          <Grid item xs={12} sm={6} >
                            <TextField
                              className={classes.margin}
                              id="input-with-icon-textfield"
                              label="Facebook"
                              variant="outlined"
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <FacebookIcon />
                                  </InputAdornment>
                                ),
                              }}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6} >
                            <TextField
                              className={classes.margin}
                              id="social-twitter"
                              label="Twitter"
                              variant="outlined"
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <TwitterIcon />
                                  </InputAdornment>
                                ),
                              }}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6} >
                            <TextField
                              className={classes.margin}
                              id="social-instagram"
                              label="Instagram"
                              variant="outlined"
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <InstagramIcon/>
                                  </InputAdornment>
                                ),
                              }}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6} >
                            <TextField
                              className={classes.margin}
                              id="social-snapchat"
                              label="Snap Chat"
                              variant="outlined"
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <NotificationsActiveIcon />
                                  </InputAdornment>
                                ),
                              }}
                            />
                          </Grid>
                        </Grid>
                      </form>
                      <Typography className={classes.formLabel} variant="caption">REFEREE CONTACT INFO</Typography>
                      <Typography className={classes.formSubLabel} variant="caption" gutterBottom>  Referee 1
                      </Typography>
                      <form className={classes.formControl} noValidate autoComplete="off">
                        <Grid container spacing={2} style={{margin: 0, width: '100%'}}>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              required
                              name="referee1firstName"
                              id="outlined-required-referee1firstName"
                              label="First Name"
                              variant="outlined"
                              onChange={handleChange}
                              placeholder="Enter Referee Firstname"
                              InputLabelProps={{
                                shrink: true,
                              }}
                            />
                          </Grid>

                          <Grid item xs={12} sm={6}>
                            <TextField
                              id="outlined-referee1lastName"
                              label="Last Name"
                              variant="outlined"
                              name="referee1lastName"
                              onChange={handleChange}
                              placeholder="Enter Referee Lastname"
                              InputLabelProps={{
                                shrink: true,
                              }}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              id="outlined-referee1email"
                              label="Email Address"
                              type="email"
                              variant="outlined"
                              name="referee1email"
                              onChange={handleChange}
                              placeholder="Enter Referee Email Address"
                              InputLabelProps={{
                                shrink: true,
                              }}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              id="outlined-referee1mobile"
                              label="Mobile Number"
                              type="number"
                              variant="outlined"
                              name="referee1mobile"
                              onChange={handleChange}
                              placeholder="Enter Referee Mobile Number"
                              InputLabelProps={{
                                shrink: true,
                              }}
                            />
                          </Grid>
                        </Grid>
                      </form>
                      <Typography className={classes.formSubLabel} variant="caption" gutterBottom>  Referee 2
                      </Typography>
                      <form className={classes.formControl} noValidate autoComplete="off">
                        <Grid container spacing={2} style={{margin: 0, width: '100%'}}>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              required
                              name="referee2firstName"
                              id="outlined-required-referee2firstName"
                              label="First Name"
                              variant="outlined"
                              onChange={handleChange}
                              placeholder="Enter Referee Firstname"
                              InputLabelProps={{
                                shrink: true,
                              }}
                            />
                          </Grid>

                          <Grid item xs={12} sm={6}>
                            <TextField
                              id="outlined-referee2lastName"
                              label="Last Name"
                              variant="outlined"
                              name="referee2lastName"
                              onChange={handleChange}
                              placeholder="Enter Referee Lastname"
                              InputLabelProps={{
                                shrink: true,
                              }}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              id="outlined-referee2email"
                              label="Email Address"
                              type="email"
                              variant="outlined"
                              name="referee2email"
                              onChange={handleChange}
                              placeholder="Enter Referee Email Address"
                              InputLabelProps={{
                                shrink: true,
                              }}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              id="outlined-referee2mobile"
                              label="Mobile Number"
                              type="number"
                              variant="outlined"
                              name="referee2mobile"
                              onChange={handleChange}
                              placeholder="Enter Referee Mobile Number"
                              InputLabelProps={{
                                shrink: true,
                              }}
                            />
                          </Grid>
                        </Grid>
                      </form>
                      <Typography className={classes.formSubLabel} variant="caption" gutterBottom>  Referee 3
                      </Typography>
                      <form className={classes.formControl} noValidate autoComplete="off">
                        <Grid container spacing={2} style={{margin: 0, width: '100%'}}>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              required
                              name="referee3firstName"
                              id="outlined-required-referee3firstName"
                              label="First Name"
                              variant="outlined"
                              onChange={handleChange}
                              placeholder="Enter Referee Firstname"
                              InputLabelProps={{
                                shrink: true,
                              }}
                            />
                          </Grid>

                          <Grid item xs={12} sm={6}>
                            <TextField
                              id="outlined-referee3lastName"
                              label="Last Name"
                              variant="outlined"
                              name="referee3lastName"
                              onChange={handleChange}
                              placeholder="Enter Referee Lastname"
                              InputLabelProps={{
                                shrink: true,
                              }}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              id="outlined-referee3email"
                              label="Email Address"
                              type="email"
                              variant="outlined"
                              name="referee3email"
                              onChange={handleChange}
                              placeholder="Enter Referee Email Address"
                              InputLabelProps={{
                                shrink: true,
                              }}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              id="outlined-referee3mobile"
                              label="Mobile Number"
                              type="number"
                              variant="outlined"
                              name="referee3mobile"
                              onChange={handleChange}
                              placeholder="Enter Referee Mobile Number"
                              InputLabelProps={{
                                shrink: true,
                              }}
                            />
                          </Grid>
                        </Grid>
                      </form>
                      <Typography className={classes.formSubLabel} variant="caption" gutterBottom>  Referee 4
                      </Typography>
                      <form className={classes.formControl} noValidate autoComplete="off">
                        <Grid container spacing={2} style={{margin: 0, width: '100%'}}>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              required
                              name="referee4firstName"
                              id="outlined-required-referee4firstName"
                              label="First Name"
                              variant="outlined"
                              onChange={handleChange}
                              placeholder="Enter Referee Firstname"
                              InputLabelProps={{
                                shrink: true,
                              }}
                            />
                          </Grid>

                          <Grid item xs={12} sm={6}>
                            <TextField
                              id="outlined-referee4lastName"
                              label="Last Name"
                              variant="outlined"
                              name="referee4lastName"
                              onChange={handleChange}
                              placeholder="Enter Referee Lastname"
                              InputLabelProps={{
                                shrink: true,
                              }}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              id="outlined-referee4email"
                              label="Email Address"
                              type="email"
                              variant="outlined"
                              name="referee4email"
                              onChange={handleChange}
                              placeholder="Enter Referee Email Address"
                              InputLabelProps={{
                                shrink: true,
                              }}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              id="outlined-referee4mobile"
                              label="Mobile Number"
                              type="number"
                              variant="outlined"
                              name="referee4mobile"
                              onChange={handleChange}
                              placeholder="Enter Referee Mobile Number"
                              InputLabelProps={{
                                shrink: true,
                              }}
                            />
                          </Grid>
                        </Grid>
                      </form>
                      <Typography className={classes.formSubLabel} variant="caption" gutterBottom>  Referee 5
                      </Typography>
                      <form className={classes.formControl} noValidate autoComplete="off">
                        <Grid container spacing={2} style={{margin: 0, width: '100%'}}>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              required
                              name="referee5firstName"
                              id="outlined-required-referee5firstName"
                              label="First Name"
                              variant="outlined"
                              onChange={handleChange}
                              placeholder="Enter Referee Firstname"
                              InputLabelProps={{
                                shrink: true,
                              }}
                            />
                          </Grid>

                          <Grid item xs={12} sm={6}>
                            <TextField
                              id="outlined-referee5lastName"
                              label="Last Name"
                              variant="outlined"
                              name="referee5lastName"
                              onChange={handleChange}
                              placeholder="Enter Referee Lastname"
                              InputLabelProps={{
                                shrink: true,
                              }}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              id="outlined-referee5email"
                              label="Email Address"
                              type="email"
                              variant="outlined"
                              name="referee5email"
                              onChange={handleChange}
                              placeholder="Enter Referee Email Address"
                              InputLabelProps={{
                                shrink: true,
                              }}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              id="outlined-referee5mobile"
                              label="Mobile Number"
                              type="number"
                              variant="outlined"
                              name="referee5mobile"
                              onChange={handleChange}
                              placeholder="Enter Referee Mobile Number"
                              InputLabelProps={{
                                shrink: true,
                              }}
                            />
                          </Grid>
                        </Grid>
                      </form>
                    </Paper>
                     //
                  )}
                  {activeStep === 6  && (
                    <div className={classes.smallContainer}>
                      <Paper className={classes.paper}>
                        <Grid item container xs={12}>
                          <Grid item xs={12}>
                            <Typography variant="h6" gutterBottom>
                              Congratulations{" "}
                              <span >
                                {firstName}!!!
                              </span>
                            </Typography>

                            <Typography variant="h6" gutterBottom>
                              An email has been sent to you with your loan application ID.
                              If you wish to make enquiries about your loan,
                              please send an email to borrow@InstaKash.com.
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                              Your dashboard is ready for you to review your loan history
                            </Typography>
                            <Button fullWidth variant="outlined" onClick={this.props.handler}>
                              Back to Dashboard
                            </Button>
                          </Grid>
                        </Grid>
                      </Paper>
                    </div>
                  )}
                  <div className={classes.flexBar}>
                    {activeStep < 5 && (
                      <Button
                        fullWidth
                        variant="outlined"
                        disabled={activeStep === 0}
                        onClick={this.handleBack}
                        className={classes.backButton}
                        size="large"
                      >
                        Back
                      </Button>
                    )}
                    {this.state.activeStep === 4 ?
                      (<React.Fragment>
                        <Button
                          fullWidth
                          variant="contained"
                          color="primary"
                          onClick={this.submit}
                          disabled={loading}
                        >
                          {loading ? <CircularProgress size={24} className={classes.buttonProgress}/> : 'ACCEPT'}
                        </Button>
                      </React.Fragment>
                      )
                    : (<Button
                      fullWidth
                      variant="contained"
                      color="primary"
                      onClick={
                        activeStep !== 6 ? this.handleNext : this.goToDashboard.bind(this)
                      }
                      size="large"
                      disabled={
                          this.state.activeStep === 0 && !this.state.termsChecked
                        }>
                        {this.stepActions()}
                      </Button>)}
                  </div>
                </div>
              </Grid>
            </Grid>
          </Grid>
        </div>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(LoanApplicationForm);
