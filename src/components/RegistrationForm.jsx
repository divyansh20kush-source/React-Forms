import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import './RegistrationForm.css';

// ── Zod Schema ──────────────────────────────────────────────
const memberSchema = z.object({
  name: z.string().min(1, 'Member name is required'),
});

const schema = z.object({
  captainName: z.string().min(1, 'Captain name is required'),
  rollNumber: z.string().min(1, 'Roll number is required'),
  participationMode: z.enum(['Solo', 'Team'], {
    errorMap: () => ({ message: 'Please select a participation mode' }),
  }),
  teamMembers: z.array(memberSchema).optional(),
  projectTopic: z.enum(
    ['Industrial Automation', 'Transportation', 'Agriculture', 'Healthcare', 'Home Automation'],
    { errorMap: () => ({ message: 'Please select a project topic' }) }
  ),
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

const TOPICS = [
  'Industrial Automation',
  'Transportation',
  'Agriculture',
  'Healthcare',
  'Home Automation',
];

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
      captainName: '',
      rollNumber: '',
      participationMode: '',
      teamMembers: [],
      projectTopic: '',
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

    const teamMembersStr =
      data.participationMode === 'Team'
        ? (data.teamMembers?.map((m) => m.name).filter(Boolean).join(', ') || 'N/A')
        : 'N/A';

    const payload = {
      captainName:       data.captainName,
      rollNumber:        data.rollNumber,
      participationMode: data.participationMode,
      teamMembers:       teamMembersStr,
      projectTopic:      data.projectTopic,
      submittedAt:       new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
    };

    // GAS does a 302 redirect on every request. POST bodies are dropped
    // during that redirect (HTTP spec). GET params survive in the URL,
    // so this is the only approach that reliably delivers data to GAS.
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

          {/* Captain Name */}
          <div className="field-group">
            <label className="field-label" htmlFor="captainName">
              Captain Name <span className="required-dot">*</span>
            </label>
            <input
              id="captainName"
              className={`field-input${errors.captainName ? ' error' : ''}`}
              type="text"
              placeholder="Enter your full name"
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

          {/* Roll Number */}
          <div className="field-group">
            <label className="field-label" htmlFor="rollNumber">
              Roll Number <span className="required-dot">*</span>
            </label>
            <input
              id="rollNumber"
              className={`field-input${errors.rollNumber ? ' error' : ''}`}
              type="text"
              placeholder="e.g. 2023CSE001"
              {...register('rollNumber')}
            />
            {errors.rollNumber && (
              <span className="field-error" role="alert">
                <IconAlert />
                {errors.rollNumber.message}
              </span>
            )}
          </div>

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

          {/* Team Members (dynamic) */}
          {isTeam && (
            <div className="team-section" id="team-members-section">
              <div className="team-section-header">
                <span className="team-section-title">
                  <IconUsers />
                  Team Members
                </span>
                {fields.length > 0 && (
                  <span className="team-count-badge">{fields.length} member{fields.length !== 1 ? 's' : ''}</span>
                )}
              </div>

              {fields.length === 0 && (
                <p className="team-empty-state">
                  No members added yet — click below to add team members.
                </p>
              )}

              {fields.map((field, index) => (
                <div className="team-member-row" key={field.id}>
                  <span className="member-number">{index + 1}</span>
                  <div className="member-input-group">
                    <input
                      id={`teamMember-${index}`}
                      className={`field-input${errors.teamMembers?.[index]?.name ? ' error' : ''}`}
                      type="text"
                      placeholder={`Member ${index + 1} full name`}
                      {...register(`teamMembers.${index}.name`)}
                    />
                    {errors.teamMembers?.[index]?.name && (
                      <span className="field-error" role="alert">
                        <IconAlert />
                        {errors.teamMembers[index].name.message}
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    className="btn-remove"
                    onClick={() => remove(index)}
                    aria-label={`Remove member ${index + 1}`}
                    id={`remove-member-${index}`}
                  >
                    <IconX />
                  </button>
                </div>
              ))}

              <button
                type="button"
                className="btn-add-member"
                onClick={() => append({ name: '' })}
                id="add-member-btn"
              >
                <IconPlus />
                Add Member
              </button>
            </div>
          )}

          <div className="form-divider">Project Details</div>

          {/* Project Topic */}
          <div className="field-group">
            <label className="field-label" htmlFor="projectTopic">
              Project Topic <span className="required-dot">*</span>
            </label>
            <div className="field-select-wrapper">
              <select
                id="projectTopic"
                className={`field-select${errors.projectTopic ? ' error' : ''}`}
                {...register('projectTopic')}
              >
                <option value="" disabled>Select a topic...</option>
                {TOPICS.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              <span className="select-arrow"><IconChevron /></span>
            </div>
            {errors.projectTopic && (
              <span className="field-error" role="alert">
                <IconAlert />
                {errors.projectTopic.message}
              </span>
            )}
          </div>

          {/* Global submit error */}
          {submitError && (
            <div className="field-error" style={{ fontSize: '0.85rem', padding: '0.5rem 0' }} role="alert">
              <IconAlert />
              {submitError}
            </div>
          )}

          {/* Submit Button */}
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
        </form>

        <FormFooter />
      </div>
    </div>
  );
}
