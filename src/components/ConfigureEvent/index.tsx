import style from './ConfigureEvent.module.scss'
import React from 'react'
import { Form, Input, Segment, Dropdown, Checkbox, Button } from 'semantic-ui-react'

type ClassesOptions = {
  key: string,
  text: string,
  value: string
}

const ConfigureEvent = () => {

  const classesOptions: ClassesOptions[] = [
    { key: 'jww', text: 'Jumpers', value: 'jww' },
    { key: 'std', text: 'Standard', value: 'std' },
    { key: 't2b', text: 'Time 2 Beat', value: 't2b'},
    { key: 'fast', text: 'Fifteen and Send Time', value: 'fast' },
    { key: 'prem', text: 'Premier', value: 'premier' }
  ]

  return (
    <div className={style.configureTrialContainer}>
       <Form>
          <Segment.Group>
            <Segment>
              <h4>Basic Configuration</h4>
              <Form.Field 
              id='name'
              label='Name'
              placeholder='Name' 
              control={Input}             
              />
              <Form.Group>
                <Form.Field 
                  id='startDate'
                  label='Start Date'
                  placeholder='Start Date'
                  control='input'
                  type='date'
                />
                <Form.Field 
                  id='endDate'
                  label='End Date'
                  placeholder='End Date'
                  control='input'
                  type='date'
                />
              </Form.Group>
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
            </Segment>
            <Segment>
              <h4>Registration</h4>
              <Form.Field 
                id='enableRegistration'
                label='Enable Registration'
                control={Checkbox}
              />
              <Form.Group>
                <Form.Field 
                  id='onlineRegistration'
                  label='Number of Online Runs'
                  control={Input}
                  type='number'
                  min={0}
                />
                <Form.Field 
                  id='mailRegistration'
                  label='Number of Mail-in Runs'
                  control={Input}
                  type='number'
                  min={0}
                />                
              </Form.Group>
              <Form.Field 
                id='cutoffDate'
                label='Registration Cutoff'
                placeholder='Registration Cutoff'
                control='input'
                type='date'
                />
              <Form.Group>
                <Form.Field 
                  id='cost1'
                  label='Default Price per Run'
                  placeholder='18.00'
                  control={Input}
                  type='text'
                />
                <Form.Field 
                  id='cost2'
                  label='Alternate Price per Run'
                  placeholder='16.00'
                  control={Input}
                  type='text'
                />
              </Form.Group>               
            </Segment>
            <Segment>
              <h4>Classes</h4>
              <Form.Group>
                <Form.Field
                  id='classesOptions'
                  multiple
                  selection
                  options={classesOptions}
                  control={Dropdown}
                  placeholder='Standard'
                />
                <Form.Field
                  id='allowPreferred'
                  label='Allow Preferred'
                  control={Checkbox}
                />
              </Form.Group>              
              <Form.Field 
                id='rings'
                label='Number of Rings'
                control={Input}
                type='number'
                max={10}
                min={0}
              />
            </Segment>
            <div className={style.buttonContainer}>
              <Button color='black'>Submit</Button>
            </div>
            
          </Segment.Group>          
        </Form>
    </div>
  )
}

export default ConfigureEvent