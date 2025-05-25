// src/app/dashboard/help/page.tsx
export default function HelpPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Help Center</h1>
      <p className="text-lg text-gray-600 mb-12 text-center">
        Welcome to the FeedbackHub Help Center. Here you&apos;ll find information and guides on how to use our platform effectively.
      </p>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <section className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-2xl font-semibold mb-3 text-indigo-600">Getting Started</h2>
          <div className="text-gray-700 space-y-4">
            <p><strong>Welcome to FeedbackHub!</strong> Our platform is designed to help you effortlessly collect, manage, and analyze feedback from your users, customers, or team members.</p>
            
            <div>
              <h3 className="text-lg font-semibold mb-1 text-indigo-500">Signing Up & Logging In</h3>
              <p>To start using FeedbackHub, you&apos;ll need to create an account. Visit our <a href="/auth/signup" className="text-indigo-600 hover:underline">Sign Up page</a> and follow the prompts. If you already have an account, you can <a href="/auth" className="text-indigo-600 hover:underline">Log In here</a>.</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-1 text-indigo-500">Dashboard Overview</h3>
              <p>Once logged in, you&apos;ll land on your main Dashboard. The navigation bar provides access to key areas:</p>
              <ul className="list-disc list-inside ml-4 mt-1">
                <li><strong>Dashboard:</strong> Your central hub for an overview of recent activity and key metrics.</li>
                <li><strong>Analytics:</strong> Dive deeper into feedback trends and data visualizations.</li>
                <li><strong>Send Requests:</strong> Create and send out new feedback requests.</li>
                <li><strong>Request History:</strong> View the status and responses of your past requests.</li>
                <li><strong>Billing:</strong> Manage your subscription and payment details.</li>
                <li><strong>Settings:</strong> Configure your account preferences.</li>
                <li><strong>Help:</strong> Access this help center.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-1 text-indigo-500">User Settings & Profile</h3>
              <p>You can manage your profile information, such as your name and email, and adjust account settings by clicking on your name in the top-right corner and navigating to the &apos;Settings&apos; page.</p>
            </div>
          </div>
        </section>

        <section className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-2xl font-semibold mb-3 text-indigo-600">Managing Feedback Forms</h2>
          <div className="text-gray-700 space-y-4">
            <p>FeedbackHub provides robust tools to create, customize, and manage your feedback forms. Effective forms lead to better insights.</p>

            <div>
              <h3 className="text-lg font-semibold mb-1 text-indigo-500">Creating a New Form</h3>
              <p>To create a new feedback form, navigate to the <Link href="/dashboard/requests" className="text-indigo-600 hover:underline">Send Requests</Link> page from the main dashboard navigation. Click on the &quot;Create New Form&quot; button to open the form builder.</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-1 text-indigo-500">Form Builder Interface</h3>
              <p>Our intuitive form builder allows you to easily add and configure various elements for your feedback form. You can typically define:</p>
              <ul className="list-disc list-inside ml-4 mt-1">
                <li><strong>Title:</strong> Give your form a clear and concise title.</li>
                <li><strong>Main Question:</strong> The primary question you want to ask (e.g., &quot;How satisfied are you?&quot;).</li>
                <li><strong>Form Type:</strong> Choose the type of input you want to collect. Common types include:
                  <ul className="list-disc list-inside ml-6">
                    <li><strong>Rating Scales:</strong> For questions like satisfaction scores (e.g., 1-5 stars, 1-10 scale).</li>
                    <li><strong>Open Text:</strong> For qualitative feedback and detailed comments.</li>
                    <li><strong>Net Promoter Score (NPS):</strong> To measure customer loyalty.</li>
                    <li><strong>Multiple Choice:</strong> For predefined answer options.</li>
                  </ul>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-1 text-indigo-500">Customizing Form Settings</h3>
              <p>Personalize your forms to match your brand and specific needs. Key settings you can customize include:</p>
              <ul className="list-disc list-inside ml-4 mt-1">
                <li><strong>Form Title & Question:</strong> As set in the form builder.</li>
                <li><strong>Appearance:</strong> Customize elements like the primary color of the form to align with your branding. Some form types, like rating scales, might allow specifying the maximum rating value (e.g., 5 stars vs. 10 stars).</li>
                <li><strong>Branding:</strong> (If available) Options to add your logo or custom messages.</li>
              </ul>
              <p className="mt-1">Refer to the form creation interface for all available customization options for each form type.</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-1 text-indigo-500">Viewing and Managing Existing Forms</h3>
              <p>All your created forms are listed on the <Link href="/dashboard/requests/history" className="text-indigo-600 hover:underline">Request History</Link> page. Here you can see:</p>
              <ul className="list-disc list-inside ml-4 mt-1">
                <li>A list of all forms, their titles, and creation dates.</li>
                <li>The status of each form (e.g., active, collecting responses, closed).</li>
                <li>Quick statistics like the number of responses received.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-1 text-indigo-500">Editing or Deleting Forms</h3>
              <p>From the <Link href="/dashboard/requests/history" className="text-indigo-600 hover:underline">Request History</Link> page, you can typically perform actions on existing forms:</p>
              <ul className="list-disc list-inside ml-4 mt-1">
                <li><strong>Edit:</strong> Click on a form or an &quot;Edit&quot; icon to modify its settings, questions, or appearance.</li>
                <li><strong>Delete:</strong> Remove forms that are no longer needed. Be cautious, as this action is often irreversible.</li>
              </ul>
              <p className="mt-1">Always ensure your form is configured correctly before sharing it widely.</p>
            </div>
          </div>
        </section>

        <section className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-2xl font-semibold mb-3 text-indigo-600">Viewing and Analyzing Responses</h2>
          <div className="text-gray-700 space-y-4">
            <p>Once your feedback forms start collecting responses, FeedbackHub provides tools to view and analyze this valuable data.</p>

            <div>
              <h3 className="text-lg font-semibold mb-1 text-indigo-500">Accessing Responses</h3>
              <p>You can view responses for each form directly from the <Link href="/dashboard/requests/history" className="text-indigo-600 hover:underline">Request History</Link> page. Typically, you would click on a specific form in the list or a dedicated &quot;View Responses&quot; button associated with that form.</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-1 text-indigo-500">How Responses are Displayed</h3>
              <p>Responses are generally presented in a clear and organized manner:</p>
              <ul className="list-disc list-inside ml-4 mt-1">
                <li><strong>List View:</strong> You might see a summary table or list of all responses for a form, showing key information like the response content, submission date, and respondent details (if collected).</li>
                <li><strong>Individual Response View:</strong> Clicking on a specific response in the list view often opens a more detailed view of that single submission.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-1 text-indigo-500">Filtering and Sorting Responses</h3>
              <p>To help you manage and analyze large volumes of feedback, FeedbackHub may offer features to filter and sort responses. (Note: Specific capabilities may vary or be planned for future updates.)</p>
              <ul className="list-disc list-inside ml-4 mt-1">
                <li><strong>Filtering:</strong> Options to filter responses by date range, specific answers (e.g., only 5-star ratings), or respondent information.</li>
                <li><strong>Sorting:</strong> Ability to sort responses by submission date, rating, or other criteria to easily identify trends or specific feedback points.</li>
              </ul>
              <p className="mt-1">Check the interface on the response viewing page for available filtering and sorting options.</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-1 text-indigo-500">Analytics Dashboard Overview</h3>
              <p>For a higher-level view of your feedback data, head to the <Link href="/dashboard/analytics" className="text-indigo-600 hover:underline">Analytics</Link> page. This dashboard provides aggregated insights such as:</p>
              <ul className="list-disc list-inside ml-4 mt-1">
                <li><strong>Total Responses:</strong> Overall count of feedback submissions across one or all forms.</li>
                <li><strong>Average Ratings/Scores:</strong> For forms using rating scales or NPS, see the average scores.</li>
                <li><strong>Response Trends:</strong> Visualizations like charts or graphs showing how feedback changes over time.</li>
                <li><strong>Most Common Feedback:</strong> (For text responses, if AI analysis is available) Themes or frequently mentioned keywords.</li>
              </ul>
              <p className="mt-1">The Analytics dashboard helps you understand overall sentiment, track performance, and identify areas for improvement without needing to go through every single response individually.</p>
            </div>
          </div>
        </section>

        <section className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-2xl font-semibold mb-3 text-indigo-600">Social Sharing & Testimonials</h2>
          <div className="text-gray-700 space-y-4">
            <p>Leverage positive feedback by transforming it into engaging social media content. FeedbackHub aims to make this process seamless.</p>

            <div>
              <h3 className="text-lg font-semibold mb-1 text-indigo-500">Identifying Shareable Feedback</h3>
              <p>After reviewing responses (see &quot;Viewing and Analyzing Responses&quot;), identify feedback that is positive, constructive, and suitable for a public audience. Look for comments that highlight specific strengths of your product or service.</p>
              {/* Future: Could mention AI suggestions for shareable content if that feature is planned. */}
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-1 text-indigo-500">Generating Testimonial Cards</h3>
              <p>FeedbackHub is designed to help you create visually appealing testimonial cards from selected feedback. This process often involves:</p>
              <ul className="list-disc list-inside ml-4 mt-1">
                <li>Selecting a specific piece of feedback.</li>
                <li>Choosing a pre-designed template for the testimonial card. (Support for Vercel OG for dynamic image generation is planned for creating these cards).</li>
                <li>Customizing basic elements such as colors or potentially adding your logo, depending on available features.</li>
              </ul>
              <p className="mt-1">The goal is to produce an attractive image or post that&apos;s ready for social media.</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-1 text-indigo-500">Direct Social Media Sharing</h3>
              <p>Once your testimonial card is generated, you can share it directly to your connected social media accounts. FeedbackHub plans to support:</p>
              <ul className="list-disc list-inside ml-4 mt-1">
                <li><strong>One-click sharing:</strong> Buttons to quickly post to platforms like Twitter and LinkedIn.</li>
                <li><strong>Copyable content:</strong> Options to copy the generated image or text to share on other platforms manually.</li>
              </ul>
              <p className="mt-1">You may need to authorize FeedbackHub to access your social media accounts for direct posting.</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-1 text-indigo-500">QR Codes for Feedback Forms</h3>
              <p>To make it easy for users to access your feedback forms, especially in physical locations or on printed materials, FeedbackHub plans to offer QR code generation. You will be able to:</p>
              <ul className="list-disc list-inside ml-4 mt-1">
                <li>Generate a unique QR code for a specific feedback form.</li>
                <li>Download the QR code image to use in various contexts (e.g., on flyers, at events, on packaging).</li>
              </ul>
              <p className="mt-1">Scanning the QR code will take users directly to your feedback form.</p>
            </div>
            <p><em>Note: Some social sharing features, such as specific platform integrations, testimonial card customization options, and QR codes, are part of our ongoing development as outlined in our implementation plan. Availability may vary.</em></p>
          </div>
        </section>

        <section className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-2xl font-semibold mb-3 text-indigo-600">Embedding Widgets</h2>
          <div className="text-gray-700 space-y-4">
            <p>FeedbackHub allows you to seamlessly integrate feedback collection directly into your own website or application using embeddable widgets. This means users can submit feedback without leaving your site.</p>

            <div>
              <h3 className="text-lg font-semibold mb-1 text-indigo-500">How it Works</h3>
              <p>The widget is typically an iframe containing your feedback form that gets embedded into a designated area on your webpage. You&apos;ll add a small script tag to your site that handles loading and displaying the form.</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-1 text-indigo-500">Getting Your Widget Script</h3>
              <p>For each feedback form you create, FeedbackHub will provide a unique script tag. You&apos;ll usually find this in the form&apos;s settings or sharing options page within your FeedbackHub dashboard (e.g., on the <Link href="/dashboard/requests/history" className="text-indigo-600 hover:underline">Request History</Link> page, select a form to find its embed code).</p>
              <p className="mt-1">The script tag will look something like this:</p>
              <pre className="bg-gray-100 p-3 rounded-md text-sm overflow-x-auto my-2">
                <code>
                  {`
<div id="feedback-widget-container"></div>
<script 
  src="https://feedbackhub.app/widget.js" 
  data-form-id="YOUR_UNIQUE_FORM_ID"
  data-container="feedback-widget-container">
</script>
                  `.trim()}
                </code>
              </pre>
              <p className="mt-1">Make sure to replace <code>YOUR_UNIQUE_FORM_ID</code> with the actual ID of your form.</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-1 text-indigo-500">Embedding on Your Website</h3>
              <p>To embed the widget:</p>
              <ol className="list-decimal list-inside ml-4 mt-1">
                <li>Create a `div` element in your HTML where you want the widget to appear. Give this `div` a unique ID.</li>
                <li>Copy the provided script tag from FeedbackHub.</li>
                <li>Paste the script tag into your HTML, preferably just before the closing `&lt;/body&gt;` tag.</li>
                <li>Ensure the `data-form-id` attribute in the script tag correctly points to your form.</li>
                <li>Ensure the `data-container` attribute in the script tag matches the ID of the `div` you created in step 1.</li>
              </ol>
              <p className="mt-1">For example, if you created `&lt;div id="my-feedback-area"&gt;&lt;/div&gt;`, your script tag&apos;s `data-container` attribute should be `my-feedback-area`.</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-1 text-indigo-500">Understanding Script Attributes</h3>
              <ul className="list-disc list-inside ml-4 mt-1">
                <li><strong><code>src="https://feedbackhub.app/widget.js"</code></strong>: This is the URL to the FeedbackHub widget script. It should not be changed.</li>
                <li><strong><code>data-form-id="YOUR_UNIQUE_FORM_ID"</code></strong>: This is crucial. It tells the script which of your feedback forms to load. You&apos;ll get this ID from FeedbackHub for each form.</li>
                <li><strong><code>data-container="feedback-widget-container"</code></strong>: This optional attribute specifies the ID of the HTML element (usually a `div`) where the widget iframe should be inserted. If omitted, the widget might try to append to a default ID like `feedbackhub-widget` or directly to the body, depending on the script&apos;s implementation. The example in `docs/features/widget-implementation.md` uses `feedbackhub-widget` as a default if `data-container` is not provided or `feedback-widget` if it is, as shown in the example. For clarity, it's best to specify it.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-1 text-indigo-500">Customization Options</h3>
              <p>FeedbackHub plans to offer several ways to customize the appearance and behavior of the embedded widget to better match your site&apos;s design and needs. These options might be configured via additional `data-*` attributes in the script tag or within the form settings in your dashboard. Planned customizations include:</p>
              <ul className="list-disc list-inside ml-4 mt-1">
                <li><strong>Custom Colors:</strong> Adjust the widget&apos;s color scheme.</li>
                <li><strong>Position:</strong> Choose between an inline embed (within the flow of your page content) or a floating button/tab that opens the form.</li>
                <li><strong>Size:</strong> Options for compact or full-size versions of the form.</li>
                <li><strong>Language:</strong> If your form supports multiple languages, specify the default language for the widget.</li>
              </ul>
              <p className="mt-1"><em>Note: The availability of specific customization options may vary. Please refer to the widget configuration section for your form within the FeedbackHub dashboard for the most up-to-date details.</em></p>
            </div>
          </div>
        </section>

        <section className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-2xl font-semibold mb-3 text-indigo-600">Account & Billing</h2>
          <div className="text-gray-700 space-y-4">
            <p>This section provides guidance on managing your FeedbackHub account settings, subscription plans, and billing details. Most account-related actions can be performed via the <Link href="/dashboard/settings" className="text-indigo-600 hover:underline">Settings</Link> page.</p>

            <div>
              <h3 className="text-lg font-semibold mb-1 text-indigo-500">Accessing Account Settings</h3>
              <p>You can manage your personal information and account preferences by navigating to the <Link href="/dashboard/settings" className="text-indigo-600 hover:underline">Settings</Link> page. This typically includes:</p>
              <ul className="list-disc list-inside ml-4 mt-1">
                <li><strong>Profile Information:</strong> Update your name, email address, and other personal details.</li>
                <li><strong>Password Changes:</strong> Securely change your account password.</li>
                <li><strong>Preferences:</strong> Adjust notification settings or other account-specific preferences as they become available.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-1 text-indigo-500">Managing Subscription Plans</h3>
              <p>FeedbackHub is planned to offer different subscription tiers, including a free tier and various paid plans with enhanced features (as outlined in our implementation plan). You will be able to manage your subscription from the <Link href="/dashboard/billing" className="text-indigo-600 hover:underline">Billing</Link> page within your dashboard. This may include:</p>
              <ul className="list-disc list-inside ml-4 mt-1">
                <li>Viewing current plan details.</li>
                <li>Upgrading to a higher-tier plan.</li>
                <li>Downgrading your plan (subject to terms and conditions).</li>
                <li>Comparing features across different available plans.</li>
              </ul>
              <p className="mt-1">Details about specific plan features and pricing will be available on our website and within the billing section of your dashboard once these are fully implemented.</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-1 text-indigo-500">Billing History & Payment Methods</h3>
              <p>Payment processing for FeedbackHub subscriptions is planned to be handled by Stripe, a secure and widely trusted payment provider. On the <Link href="/dashboard/billing" className="text-indigo-600 hover:underline">Billing</Link> page, you will typically be able to:</p>
              <ul className="list-disc list-inside ml-4 mt-1">
                <li><strong>View Billing History:</strong> Access invoices and review past payments.</li>
                <li><strong>Manage Payment Methods:</strong> Add, update, or remove your credit/debit card details.</li>
                <li><strong>Download Invoices:</strong> Get copies of your invoices for accounting purposes.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-1 text-indigo-500">Closing Your Account</h3>
              <p>If you wish to close your FeedbackHub account, you will typically find an option to do so within the <Link href="/dashboard/settings" className="text-indigo-600 hover:underline">Settings</Link> page. Please be aware that account closure is often permanent and may result in the irreversible deletion of your data, including forms and responses.</p>
              <p className="mt-1">We recommend exporting any necessary data before closing your account. If you have any trouble or specific concerns, please contact our support team for assistance.</p>
            </div>
            <p><em>Note: Billing features, including subscription management and payment processing via Stripe, are part of our planned development. Specific functionalities will become available as outlined in our implementation plan.</em></p>
          </div>
        </section>
      </div>
    </div>
  );
}
