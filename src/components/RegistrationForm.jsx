import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import './RegistrationForm.css';

// ── Zod Schema ──────────────────────────────────────────────
const memberSchema = z.object({
  fullName: z.string().min(1, 'Member full name is required'),
  rollNumber: z.string().min(1, 'Member roll number is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Valid phone number required'),
});

const schema = z.object({
  projectTopic: z.string().min(1, 'Project topic is required'),
  captainName: z.string().min(1, 'Captain full name is required'),
  captainRoll: z.string().min(1, 'Captain roll number is required'),
  captainEmail: z.string().email('Invalid email address'),
  captainPhone: z.string().min(10, 'Valid phone number required'),
  participationMode: z.enum(['Solo', 'Team'], {
    errorMap: () => ({ message: 'Please select a participation mode' }),
  }),
  teamMembers: z.array(memberSchema).optional(),
});

// ── Icon Components ──────────────────────────────────────────
const IconStar = () => (
  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
);
const IconUsers = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);
const IconPlus = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
);
const IconX = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
);
const IconChevron = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);
const IconAlert = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 22C6.48 22 2 17.52 2 12S6.48 2 12 2s10 4.48 10 10-4.48 10-10 10zm-1-7v2h2v-2h-2zm0-8v6h2V7h-2z"/>
  </svg>
);
const IconCheckCircle = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
    <polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);
const IconSend = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"/>
    <polygon points="22 2 15 22 11 13 2 9 22 2"/>
  </svg>
);

const GOOGLE_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbwSnO7VCuJtuxsCgWbt-6mIu0F98xUrPIMBVt03j6fYhcVeqEAMDS19gIMkjwcM8vUZwg/exec';

// ── Footer ───────────────────────────────────────────────────
function FormFooter() {
  return (
    <footer className="form-footer">
      <p className="footer-credit">
        Created by: <strong>Divyansh Kushwaha</strong>
      </p>
      <a
        href="mailto:divyanshkushwaha123bkt@gmail.com"
        className="footer-email"
        id="footer-contact-link"
      >
        divyanshkushwaha123bkt@gmail.com
      </a>
    </footer>
  );
}

// ── Success View ─────────────────────────────────────────────
function SuccessView() {
  return (
    <div className="form-card">
      <div className="success-view">
        <div className="success-icon-ring">
          <IconCheckCircle />
        </div>
        <div className="success-confetti">🎉 ✨ 🚀</div>
        <h1 className="success-title">Are you ready?</h1>
        <p className="success-subtitle">
          Your project entry was <span>successfully submitted!</span> Our team
          will review your registration and get back to you soon. Get ready to
          showcase your innovation.
        </p>
      </div>
      <FormFooter />
    </div>
  );
}

// ── Main Form Component ──────────────────────────────────────
export default function RegistrationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      projectTopic: '',
      captainName: '',
      captainRoll: '',
      captainEmail: '',
      captainPhone: '',
      participationMode: '',
      teamMembers: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'teamMembers',
  });

  const participationMode = watch('participationMode');
  const isTeam = participationMode === 'Team';

  const onSubmit = (data) => {
    setIsSubmitting(true);
    setSubmitError('');

    // Format Team Members vertically line-by-line for clean spreadsheet display
    const teamMembersFormatted =
      data.participationMode === 'Team' && data.teamMembers?.length > 0
        ? data.teamMembers
            .map(
              (m, i) =>
                `Member ${i + 1}:\n` +
                `Full Name: ${m.fullName}\n` +
                `Roll Number: ${m.rollNumber}\n` +
                `Email ID: ${m.email}\n` +
                `Phone Number: ${m.phone}`
            )
            .join('\n\n')
        : 'N/A (Solo Entry)';

    const payload = {
      projectTopic:      data.projectTopic,
      captainName:       data.captainName,
      captainRoll:       data.captainRoll,
      captainEmail:      data.captainEmail,
      captainPhone:      data.captainPhone,
      participationMode: data.participationMode,
      teamMembers:       teamMembersFormatted,
      submittedAt:       new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
    };

    const params = new URLSearchParams(payload);
    fetch(`${GOOGLE_SCRIPT_URL}?${params.toString()}`, {
      method: 'GET',
      mode:   'no-cors',
    }).catch((err) => console.error('Fetch error:', err));

    setIsSubmitting(false);
    setIsSuccess(true);
  };

  if (isSuccess) return (
    <div className="form-wrapper">
      <SuccessView />
    </div>
  );

  return (
    <div className="form-wrapper">
      <div className="form-card">
        {/* ── Header ── */}
        <div className="form-header">
          <div className="form-header-badge">
            <IconStar /> Project Registration
          </div>
          <h1 className="form-title">Register Your Project</h1>
          <p className="form-subtitle">
            Fill in the details below to submit your innovation project entry.
          </p>
        </div>

        {/* ── Form Body ── */}
        <form className="form-body" onSubmit={handleSubmit(onSubmit)} noValidate>

          {/* 1. Project Topic */}
          <div className="field-group">
            <label className="field-label" htmlFor="projectTopic">
              Project Topic <span className="required-dot">*</span>
            </label>
            <input
              id="projectTopic"
              className={`field-input${errors.projectTopic ? ' error' : ''}`}
              type="text"
              placeholder="e.g. Smart IoT Agriculture System"
              {...register('projectTopic')}
            />
            {errors.projectTopic && (
              <span className="field-error" role="alert">
                <IconAlert />
                {errors.projectTopic.message}
              </span>
            )}
          </div>

          <div className="form-divider">Team Captain Details</div>

          {/* 2. Team Captain Details */}
          <div className="grid-2-col">
            {/* Captain Full Name */}
            <div className="field-group">
              <label className="field-label" htmlFor="captainName">
                Full Name <span className="required-dot">*</span>
              </label>
              <input
                id="captainName"
                className={`field-input${errors.captainName ? ' error' : ''}`}
                type="text"
                placeholder="Captain's full name"
                autoComplete="name"
                {...register('captainName')}
              />
              {errors.captainName && (
                <span className="field-error" role="alert">
                  <IconAlert />
                  {errors.captainName.message}
                </span>
              )}
            </div>

            {/* Captain Roll Number */}
            <div className="field-group">
              <label className="field-label" htmlFor="captainRoll">
                Roll Number <span className="required-dot">*</span>
              </label>
              <input
                id="captainRoll"
                className={`field-input${errors.captainRoll ? ' error' : ''}`}
                type="text"
                placeholder="e.g. 2023CSE001"
                {...register('captainRoll')}
              />
              {errors.captainRoll && (
                <span className="field-error" role="alert">
                  <IconAlert />
                  {errors.captainRoll.message}
                </span>
              )}
            </div>

            {/* Captain Email ID */}
            <div className="field-group">
              <label className="field-label" htmlFor="captainEmail">
                Email ID <span className="required-dot">*</span>
              </label>
              <input
                id="captainEmail"
                className={`field-input${errors.captainEmail ? ' error' : ''}`}
                type="email"
                placeholder="captain@example.com"
                autoComplete="email"
                {...register('captainEmail')}
              />
              {errors.captainEmail && (
                <span className="field-error" role="alert">
                  <IconAlert />
                  {errors.captainEmail.message}
                </span>
              )}
            </div>

            {/* Captain Phone Number */}
            <div className="field-group">
              <label className="field-label" htmlFor="captainPhone">
                Phone Number <span className="required-dot">*</span>
              </label>
              <input
                id="captainPhone"
                className={`field-input${errors.captainPhone ? ' error' : ''}`}
                type="tel"
                placeholder="e.g. 9876543210"
                autoComplete="tel"
                {...register('captainPhone')}
              />
              {errors.captainPhone && (
                <span className="field-error" role="alert">
                  <IconAlert />
                  {errors.captainPhone.message}
                </span>
              )}
            </div>
          </div>

          <div className="form-divider">Participation & Team Details</div>

          {/* Participation Mode */}
          <div className="field-group">
            <label className="field-label" htmlFor="participationMode">
              Participation Mode <span className="required-dot">*</span>
            </label>
            <div className="field-select-wrapper">
              <select
                id="participationMode"
                className={`field-select${errors.participationMode ? ' error' : ''}`}
                {...register('participationMode')}
              >
                <option value="" disabled>Select mode...</option>
                <option value="Solo">Solo</option>
                <option value="Team">Team</option>
              </select>
              <span className="select-arrow"><IconChevron /></span>
            </div>
            {errors.participationMode && (
              <span className="field-error" role="alert">
                <IconAlert />
                {errors.participationMode.message}
              </span>
            )}
          </div>

          {/* 3. Team Members Details (Dynamic) */}
          {isTeam && (
            <div className="team-section" id="team-members-section">
              <div className="team-section-header">
                <span className="team-section-title">
                  <IconUsers />
                  Team Members Details
                </span>
                {fields.length > 0 && (
                  <span className="team-count-badge">{fields.length} member{fields.length !== 1 ? 's' : ''}</span>
                )}
              </div>

              {fields.length === 0 && (
                <p className="team-empty-state">
                  No team members added yet. Click "Add Member" below to include team members.
                </p>
              )}

              {fields.map((field, index) => (
                <div className="team-member-card" key={field.id}>
                  <div className="member-card-header">
                    <span className="member-card-title">
                      <span className="member-number">{index + 1}</span>
                      Member {index + 1}
                    </span>
                    <button
                      type="button"
                      className="btn-remove"
                      onClick={() => remove(index)}
                      aria-label={`Remove member ${index + 1}`}
                      id={`remove-member-${index}`}
                    >
                      <IconX /> Remove
                    </button>
                  </div>

                  <div className="grid-2-col">
                    {/* Full Name */}
                    <div className="field-group">
                      <label className="field-label" htmlFor={`teamMembers.${index}.fullName`}>
                        Full Name <span className="required-dot">*</span>
                      </label>
                      <input
                        id={`teamMembers.${index}.fullName`}
                        className={`field-input${errors.teamMembers?.[index]?.fullName ? ' error' : ''}`}
                        type="text"
                        placeholder="Member full name"
                        {...register(`teamMembers.${index}.fullName`)}
                      />
                      {errors.teamMembers?.[index]?.fullName && (
                        <span className="field-error" role="alert">
                          <IconAlert />
                          {errors.teamMembers[index].fullName.message}
                        </span>
                      )}
                    </div>

                    {/* Roll Number */}
                    <div className="field-group">
                      <label className="field-label" htmlFor={`teamMembers.${index}.rollNumber`}>
                        Roll Number <span className="required-dot">*</span>
                      </label>
                      <input
                        id={`teamMembers.${index}.rollNumber`}
                        className={`field-input${errors.teamMembers?.[index]?.rollNumber ? ' error' : ''}`}
                        type="text"
                        placeholder="e.g. 2023CSE002"
                        {...register(`teamMembers.${index}.rollNumber`)}
                      />
                      {errors.teamMembers?.[index]?.rollNumber && (
                        <span className="field-error" role="alert">
                          <IconAlert />
                          {errors.teamMembers[index].rollNumber.message}
                        </span>
                      )}
                    </div>

                    {/* Email ID */}
                    <div className="field-group">
                      <label className="field-label" htmlFor={`teamMembers.${index}.email`}>
                        Email ID <span className="required-dot">*</span>
                      </label>
                      <input
                        id={`teamMembers.${index}.email`}
                        className={`field-input${errors.teamMembers?.[index]?.email ? ' error' : ''}`}
                        type="email"
                        placeholder="member@example.com"
                        {...register(`teamMembers.${index}.email`)}
                      />
                      {errors.teamMembers?.[index]?.email && (
                        <span className="field-error" role="alert">
                          <IconAlert />
                          {errors.teamMembers[index].email.message}
                        </span>
                      )}
                    </div>

                    {/* Phone Number */}
                    <div className="field-group">
                      <label className="field-label" htmlFor={`teamMembers.${index}.phone`}>
                        Phone Number <span className="required-dot">*</span>
                      </label>
                      <input
                        id={`teamMembers.${index}.phone`}
                        className={`field-input${errors.teamMembers?.[index]?.phone ? ' error' : ''}`}
                        type="tel"
                        placeholder="e.g. 9876543210"
                        {...register(`teamMembers.${index}.phone`)}
                      />
                      {errors.teamMembers?.[index]?.phone && (
                        <span className="field-error" role="alert">
                          <IconAlert />
                          {errors.teamMembers[index].phone.message}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              <button
                type="button"
                className="btn-add-member"
                onClick={() => append({ fullName: '', rollNumber: '', email: '', phone: '' })}
                id="add-member-btn"
              >
                <IconPlus />
                Add Member
              </button>
            </div>
          )}

          {/* Global submit error */}
          {submitError && (
            <div className="field-error" style={{ fontSize: '0.85rem', padding: '0.5rem 0' }} role="alert">
              <IconAlert />
              {submitError}
            </div>
          )}

          {/* Standard Sized Submit Button */}
          <div className="submit-container">
            <button
              type="submit"
              className="btn-submit"
              disabled={isSubmitting}
              id="submit-btn"
            >
              {isSubmitting ? (
                <>
                  <span className="spinner" />
                  Submitting...
                </>
              ) : (
                <>
                  <IconSend />
                  Submit Registration
                </>
              )}
            </button>
          </div>
        </form>

        <FormFooter />
      </div>
    </div>
  );
}
