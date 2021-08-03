import style from './ConfigureEvent.module.scss'
import React, { useState } from 'react'
import { useFormik, FieldArray, Formik } from 'formik'

import { Form, Input, Tab, Dropdown, Checkbox, Button, Icon } from 'semantic-ui-react'

type ClassesOptions = {
  key: string,
  text: string,
  value: string
}

type AccordionIndex = {
  basic: boolean,
  registration: boolean,
  trials: boolean  
}

const BasicForm = () => {
  return (
    <Form>
      <Form.Field 
        id='name'
        label='Name'
        placeholder='Name' 
        control={Input}             
      />              
      <Form.Group>
        <Form.Field 
          id='locationCity'
          label='City'
          placeholder='City' 
          control={Input}             
          type='text'              
        />
        <Form.Field 
          id='locationState'
          label='State'
          placeholder='State' 
          control={Input}             
          type='text'              
        />          
        <Form.Field 
          id='locationVenue'
          label='Venue'
          placeholder='Venue' 
          control={Input}             
          type='text'              
        />          
      </Form.Group>
      <Form.Field 
        id='hostClub'
        label='Host Club'
        placeholder='Host Club' 
        control={Input}             
        type='text'
      />
      <div className={style.buttonContainer}>
        <Button color="black">Update</Button>
      </div>
    </Form>  
  )
}

const RegistrationForm = () => {
  return (
    <Form>
      <Form.Field 
        id='enableRegistration'
        label='Enable Registration'
        control={Checkbox}
      />            
      <Form.Field 
        id='cutoffDate'
        label='Registration Cutoff'
        placeholder='Registration Cutoff'
        control='input'
        type='date'
        />
      <Form.Group>
        <Form.Field 
          id='price'
          label='Price'
          placeholder='18.00'
          control={Input}
          type='text'
        />
        <Form.Field 
          id='altPrice'
          label='Discount price'
          placeholder='16.00'
          control={Input}
          type='text'
        />
      </Form.Group>
      <div className={style.buttonContainer}>
        <Button color="black">Update</Button>
      </div>
    </Form>   
  )
}

const TrialsForm = () => {
  const classesOptions: ClassesOptions[] = [
    { key: 'nov', text: 'Novice', value: 'nov' },
    { key: 'open', text: 'Open', value: 'open' },
    { key: 'exc', text: 'Excellent', value: 'exc'},
    { key: 'mast', text: 'Masters', value: 'mast' }    
  ]
  // const formik = useFormik({
  //   initialValues: {
  //     newTrials: []
  //   },
  //   onSubmit: (values) => {
  //     console.log(values)
  //   }
  // })

  return (
    <Formik 
      initialValues={{
        newTrials: []
      }}
      onSubmit={(values) => console.log(values)}
      render={formikProps => {
        console.log(formikProps.values)
        return (
          <FieldArray 
            name='newTrials'
            render={({ push }) => (
              <Form onSubmit={() => formikProps.submitForm()}>
                <div className={style.newTrialContainer}>
                  <div style={{ marginRight: '8px' }}><Button circular icon="add" onClick={() => {
                    push({
                      akcTrialNumber: '',
                      trialDate: '',
                      onlineEntries: 0,
                      mailEntries: 0,
                      standardClass: true,
                      jumpersClass: true,
                      fastClass: false,
                      t2bClass: false,
                      standardAbility: ['nov', 'open', 'exc', 'mast'],
                      standardPreferred: ['nov', 'open', 'exc', 'mast'],
                      jumpersAbility: ['nov', 'open', 'exc', 'mast'],
                      jumpersPreferred: ['nov', 'open', 'exc', 'mast'],
                      fastAbility: [],
                      fastPreferred: []
                      
                    })
                  }}/></div>
                  {formikProps.values.newTrials.length === 0 ? (
                    <div>Event has no trials. Add a new trial to the even to proceed</div>        
                  ) : null}
                </div>
                <div className={style.fieldsContainer}>
                    {formikProps.values.newTrials.length > 0 ? (
                    formikProps.values.newTrials.map((trial: any, idx: number) => (
                      <>
                        <Form.Group>
                          <Form.Field 
                            id='akcTrialNumber'
                            name={`newTrials.${idx}.akcTrialNumber`}
                            value={(formikProps.values.newTrials as any)[idx].akcTrialNumber}
                            onChange={formikProps.handleChange}
                            type='text'
                            label="AKC Trial Number"
                            control={Input}
                          />
                          <Form.Field 
                            id='trialDate'
                            name={`newTrials.${idx}.trialDate`}
                            value={(formikProps.values.newTrials as any)[idx].trialDate}
                            onChange={formikProps.handleChange}
                            label='Date'                
                            control='input'
                            type='date'
                          />
                          <Form.Field 
                            id='onlineEntries'
                            name={`newTrials.${idx}.onlineEntries`}
                            value={(formikProps.values.newTrials as any)[idx].onlineEntries}
                            onChange={formikProps.handleChange}
                            type='number'
                            control={Input}
                            label='Online Entries'
                          />
                          <Form.Field 
                            id='mailEntries'
                            name={`newTrials.${idx}.mailEntries`}
                            value={(formikProps.values.newTrials as any)[idx].mailEntries}
                            onChange={formikProps.handleChange}
                            type='number'
                            control={Input}
                            label='Mail-in Entries'
                          />       
                        </Form.Group>                                          
                        <h5>Classes: </h5>
                        <div className={style.checkboxContainer}>
                          <Form.Field
                            id='standardClass'
                            name={`newTrials.${idx}.standardClass`}
                            value={(formikProps.values.newTrials as any)[idx].standardClass}
                            checked={(formikProps.values.newTrials as any)[idx].standardClass}
                            onChange={formikProps.handleChange}
                            label='Standard'                                                                              
                            control={Checkbox}
                            style={{marginRight: '8px'}}                        
                          />
                          { (formikProps.values.newTrials as any)[idx].standardClass ? (
                            <div style={{display: 'flex'}}>
                            <Form.Field 
                              id='standardAbility'
                              name={`newTrials.${idx}.standardAbility`}
                              value={(formikProps.values.newTrials as any)[idx].standardAbility}
                              onChange={(e: any, d: any) => {                                                                
                                formikProps.setFieldValue(`newTrials.${idx}.standardAbility`, [].slice.call(d.value))
                              }}
                              label='Regular'
                              multiple
                              selection
                              control={Dropdown}
                              options={classesOptions}
                              
                            />
                            <Form.Field 
                              id='standardPreferred'
                              name={`newTrials.${idx}.standardPreferred`}
                              value={(formikProps.values.newTrials as any)[idx].standardPreferred}
                              onChange={(e: any, d: any) => {                                                                
                                formikProps.setFieldValue(`newTrials.${idx}.standardPreferred`, [].slice.call(d.value))
                              }}
                              label='Preferred'
                              multiple
                              selection
                              control={Dropdown}
                              options={classesOptions}
                            />
                            </div>
                          ): null}
                        </div>
                        <div className={style.checkboxContainer}>
                          <Form.Field
                            id='jumpersClass'
                            name={`newTrials.${idx}.jumpersClass`}
                            value={(formikProps.values.newTrials as any)[idx].jumpersClass}
                            checked={(formikProps.values.newTrials as any)[idx].jumpersClass}
                            onChange={formikProps.handleChange}
                            label='JWW'                                                                              
                            control={Checkbox}
                            style={{marginRight: '8px'}}                          
                          />
                          { (formikProps.values.newTrials as any)[idx].jumpersClass ? (
                            <div style={{display: 'flex'}}>
                            <Form.Field 
                              id='jumpersAbility'
                              name={`newTrials.${idx}.jumpersAbility`}
                              value={(formikProps.values.newTrials as any)[idx].jumpersAbility}
                              onChange={(e: any, d: any) => {                                                                
                                formikProps.setFieldValue(`newTrials.${idx}.jumpersAbility`, [].slice.call(d.value))
                              }}
                              label='Regular'
                              multiple
                              selection
                              control={Dropdown}
                              options={classesOptions}
                              
                            />
                            <Form.Field 
                              id='jumpersPreferred'
                              name={`newTrials.${idx}.jumpersPreferred`}
                              value={(formikProps.values.newTrials as any)[idx].jumpersPreferred}
                              onChange={(e: any, d: any) => {                                                                
                                formikProps.setFieldValue(`newTrials.${idx}.jumpersPreferred`, [].slice.call(d.value))
                              }}
                              label='Preferred'
                              multiple
                              selection
                              control={Dropdown}
                              options={classesOptions}
                            />
                            </div>
                          ): null}
                        </div>
                        <div className={style.checkboxContainer}>
                          <Form.Field
                              id='fastClass'
                              name={`newTrials.${idx}.fastClass`}
                              value={(formikProps.values.newTrials as any)[idx].fastClass}
                              checked={(formikProps.values.newTrials as any)[idx].fastClass}
                              onChange={formikProps.handleChange}
                              label='FAST'                                                                              
                              control={Checkbox}                          
                          />
                          { (formikProps.values.newTrials as any)[idx].fastClass ? (
                            <div style={{display: 'flex'}}>
                            <Form.Field 
                              id='fastAbility'
                              name={`newTrials.${idx}.fastAbility`}
                              value={(formikProps.values.newTrials as any)[idx].fastAbility}
                              onChange={(e: any, d: any) => {                                                                
                                formikProps.setFieldValue(`newTrials.${idx}.fastAbility`, [].slice.call(d.value))
                              }}
                              label='Regular'
                              multiple
                              selection
                              control={Dropdown}
                              options={classesOptions}
                              
                            />
                            <Form.Field 
                              id='fastPreferred'
                              name={`newTrials.${idx}.fastPreferred`}
                              value={(formikProps.values.newTrials as any)[idx].fastPreferred}
                              onChange={(e: any, d: any) => {                                                                
                                formikProps.setFieldValue(`newTrials.${idx}.fastPreferred`, [].slice.call(d.value))
                              }}
                              label='Preferred'
                              multiple
                              selection
                              control={Dropdown}
                              options={classesOptions}
                            />
                            </div>
                          ): null}
                        </div>
                          <Form.Field
                            id='t2bClass'
                            name={`newTrials.${idx}.t2bClass`}
                            value={(formikProps.values.newTrials as any)[idx].t2bClass}
                            checked={(formikProps.values.newTrials as any)[idx].t2bClass}
                            onChange={formikProps.handleChange}
                            label='T2B'                                                                              
                            control={Checkbox}                          
                          />
                          <Form.Field 
                            id='premierStandard'
                            name={`newTrials.${idx}.premierStandard`}
                            value={(formikProps.values.newTrials as any)[idx].premierStandard}
                            checked={(formikProps.values.newTrials as any)[idx].premierStandard}
                            onChange={formikProps.handleChange}
                            label='Premier Standard'
                            control={Checkbox}
                          />
                          <Form.Field 
                            id='premierJumpers'
                            name={`newTrials.${idx}.premierJumpers`}
                            value={(formikProps.values.newTrials as any)[idx].premierJumpers}
                            checked={(formikProps.values.newTrials as any)[idx].premierJumpers}
                            onChange={formikProps.handleChange}
                            label='Premier Jumpers'
                            control={Checkbox}
                          />
                        <br />                      
                      </>
                    ))
                  ) : null}
                </div>
                <Button content="Submit" type="submit" />                
              </Form>
            )}
          />
        )
      }}
    />    
  )
}

const ConfigureEvent = () => {
  const accordionIndex: AccordionIndex = {
    basic: true,
    registration: false,
    trials: false
  }
  const [selectedAccordion, setSelectedAccordion] = useState<AccordionIndex>(accordionIndex)
  
  const panes = [
    { menuItem: 'Basic', render: () => <Tab.Pane><BasicForm /></Tab.Pane> },
    { menuItem: 'Registration', render: () => <Tab.Pane><RegistrationForm /></Tab.Pane> },
    { menuItem: 'Trials', render: () => <Tab.Pane><TrialsForm /></Tab.Pane>}
  ]

  return (
    <div className={style.configureTrialContainer}>
       <Tab panes={panes}/>
    </div>
  )
}

export default ConfigureEvent