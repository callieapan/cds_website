"use client"


import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardDescriptionBlack } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { submitInterview } from "@/app/lib/actions"

export default function InterviewLogForm() {
  const [formData, setFormData] = useState({
    email: "",
    date: "",
    company: "",
    position: "",
    round: "",
    otherRound: "",
    questionAnswer: "",
    userName: "",
    contactInfo: ""
  })

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setsSubmitted] = useState(false);

  const interviewRounds = [
    { value: "technical-onsite", label: "Technical Onsite" },
    { value: "behavioral", label: "Behavioral" },
    { value: "technical-screen", label: "Technical Screen" },
    { value: "other", label: "Other" }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const result = await submitInterview(formData)
      if (result.success) {
        setsSubmitted(true)
        console.log("Submitted data:", formData)
      } else {
        throw new Error(result.error)
       }      
      } catch (error) {
        console.error('Error submitting form', error)
        alert ('Failed to submit the form. Please try again')
      } finally {
        setIsSubmitting(false)
      }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleRoundChange = (value: string) => {
    setFormData(prev => ({ ...prev, round: value }))
  }

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const isValidDate = (date: string) => {
    return /^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/\d{4}$/.test(date)
  }

  const isValidContactInfo = (contact: string) => {
    if (!contact) return true // Optional field
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const phoneRegex = /^\+?[\d\s-()]{10,}$/ // Basic phone validation
    return emailRegex.test(contact) || phoneRegex.test(contact)
  }

  const isFormValid = () => {
    return (
      isValidEmail(formData.email) &&
      isValidDate(formData.date) &&
      formData.company.trim() !== "" &&
      formData.position.trim() !== "" &&
      (formData.round !== "" && (formData.round !== "other" || formData.otherRound.trim() !== "")) &&
      formData.questionAnswer.length >= 20 &&
      isValidContactInfo(formData.contactInfo)
    )
  }

  if (submitted) {
    return (
      <Card className="max-w-2xl mx-auto p-6">
        <CardHeader>
          <CardTitle className="text-center text-2xl text-primary">Submission Received</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p>Thank you for your submission. Your entry is being reviewed.</p>
          <p>Once approved you will receive an email notification to view the interview log.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-4xl mx-auto">
      

      <div className="grid md:grid-cols-2 gap-6">
        {/* Basic Information Card */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={handleChange}
              />
              {formData.email && !isValidEmail(formData.email) && (
                <p className="text-sm text-destructive">Please enter a valid email address</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Interview Date (MM/DD/YYYY)</Label>
              <Input
                id="date"
                name="date"
                placeholder="MM/DD/YYYY"
                value={formData.date}
                onChange={handleChange}
              />
              {formData.date && !isValidDate(formData.date) && (
                <p className="text-sm text-destructive">Please enter a valid date (MM/DD/YYYY)</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Company Information Card */}
        <Card>
          <CardHeader>
            <CardTitle>Company Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="company">Company Name</Label>
              <Input
                id="company"
                name="company"
                placeholder="Enter company name"
                value={formData.company}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="position">Position</Label>
              <Input
                id="position"
                name="position"
                placeholder="Enter position title"
                value={formData.position}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-4">
              <Label>Interview Round</Label>
              <RadioGroup value={formData.round} onValueChange={handleRoundChange}>
                {interviewRounds.map((round) => (
                  <div key={round.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={round.value} id={round.value} />
                    <Label htmlFor={round.value}>{round.label}</Label>
                  </div>
                ))}
              </RadioGroup>
              {formData.round === "other" && (
                <div className="ml-6">
                  <Input
                    id="otherRound"
                    name="otherRound"
                    placeholder="Please specify the interview round"
                    value={formData.otherRound}
                    onChange={handleChange}
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Interview Q&A Card - Full Width */}
      <Card>
        <CardHeader>
          <CardTitle>Interview Question & Answer</CardTitle>
          <CardDescriptionBlack> 
              <br/> <br/>
              Please describe the question asked and share your answer. Format:<br/> <br/>
              Number of [technical/behavior/other type] rounds:<br/> 
              Question 1 - answer<br/> 
              Question 2 - answer<br/> <br/>
              If you were asked coding questions, specify what language you were asked to use, along with the details of the problem you were asked to solve, e.g. a SQL coding question that required window functions.<br/> <br/>
              
              Talk about what you did best, worst and what you think you could have improved on.<br/> <br/>
              
              Example:<br/> 
              Number of technical rounds: 2 <br/> 
              Number of behavioral rounds: 1 <br/> <br/>
              
              The metrics we measure for user growth appear to be declining, how would you determine if there is an actual decline? - use statistical tests across before and after specific periods of time
              The ML team asks you to build a feature store in table format, how would you design this table? - determine what should be the unique identifier in the table, the appropriate columns and how to deal with multiple or frequent updates of metrics/signals 
              We want to test if showing free users more of a specific paid feature would increase conversion from free to paid users. What metrics would you would use to test the hypothesis? How would you determine sample size and experiment duration?<br/> <br/>
           
            </CardDescriptionBlack>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Textarea
              id="questionAnswer"
              name="questionAnswer"
              placeholder="Describe the interview question and your answer in detail..."
              value={formData.questionAnswer}
              onChange={handleChange}
              className="min-h-[200px]"
            />
            <div className="text-sm text-muted-foreground">
              {formData.questionAnswer.length} characters
              {formData.questionAnswer.length < 20 && (
                <span className="text-destructive"> (minimum 20 characters required)</span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Optional Personal Information Cards - Moved to Bottom */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information (Optional)</CardTitle>
            <CardDescription> 
            If you'd like to disclose your name or your contact information so others may reach out for more questions or share interview experiences,  please do so here.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              {/* <Label htmlFor="userName">Your Name (Optional) <br></br>
              If you'd like to disclose your name or your contact information so others may reach out for more questions or share interview experiences,  please do so here.
              </Label> */}
              
              <Input
                id="userName"
                name="userName"
                placeholder="Enter your name"
                value={formData.userName}
                onChange={handleChange}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact Details (Optional)</CardTitle>
            <CardDescription>If you'd like to disclose your name or your contact information so others may reach out for more questions or share interview experiences,  please do so here.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              {/* <Label htmlFor="contactInfo"></Label> */}
            
              <Input
                id="contactInfo"
                name="contactInfo"
                placeholder="Enter email or phone number"
                value={formData.contactInfo}
                onChange={handleChange}
              />
              {formData.contactInfo && !isValidContactInfo(formData.contactInfo) && (
                <p className="text-sm text-destructive">Please enter a valid email or phone number</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Submit Button - Moved to bottom */}
      <Button type="submit" disabled={!isFormValid()} className="w-full">
        Submit Entry
      </Button>
    </form>
  )


