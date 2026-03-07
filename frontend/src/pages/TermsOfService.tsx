const TermsOfService = () => {
    return (
        <main className="mx-auto max-w-4xl px-6 py-10">
            <h1 className="mb-6 text-3xl font-bold">Terms of Service</h1>

            <div className="space-y-6 text-sm leading-7 text-gray-700">
                <p>
                    <strong>Effective Date:</strong> March 5, 2026
                    <br />
                    <strong>Platform:</strong> Mazad
                    <br />
                    <strong>Operator:</strong> Mazad Team
                    <br />
                    <strong>Contact:</strong> mazad@team.com
                </p>

                <p>
                    These Terms of Service govern the use of Mazad, a school project auction platform.
                    By using Mazad, you agree to these Terms.
                </p>

                <section>
                    <h2 className="mb-2 text-xl font-semibold">1. Use of the Platform</h2>
                    <p>Mazad allows users to:</p>
                    <ul className="mt-2 list-disc space-y-1 pl-6">
                        <li>create accounts</li>
                        <li>post auction listings</li>
                        <li>place bids on listed items</li>
                        <li>interact with auction-related features</li>
                    </ul>
                    <p className="mt-2">Users must use the platform lawfully and honestly.</p>
                </section>

                <section>
                    <h2 className="mb-2 text-xl font-semibold">2. Accounts</h2>
                    <p>Users are responsible for:</p>
                    <ul className="mt-2 list-disc space-y-1 pl-6">
                        <li>providing accurate account information</li>
                        <li>keeping login credentials secure</li>
                        <li>all activity that happens under their account</li>
                    </ul>
                    <p className="mt-2">
                        Mazad may suspend or remove accounts that violate these Terms.
                    </p>
                </section>

                <section>
                    <h2 className="mb-2 text-xl font-semibold">3. Listings</h2>
                    <p>Users who post listings must ensure that:</p>
                    <ul className="mt-2 list-disc space-y-1 pl-6">
                        <li>item information is accurate</li>
                        <li>listings are not misleading</li>
                        <li>they have the right to post or sell the item</li>
                        <li>listed items are not illegal, stolen, counterfeit, or prohibited</li>
                    </ul>
                    <p className="mt-2">
                        Mazad may remove any listing that violates these rules.
                    </p>
                </section>

                <section>
                    <h2 className="mb-2 text-xl font-semibold">4. Bidding</h2>
                    <p>By placing a bid, users agree to act seriously and fairly.</p>
                    <p className="mt-2">Users must not:</p>
                    <ul className="mt-2 list-disc space-y-1 pl-6">
                        <li>place fake bids</li>
                        <li>manipulate auctions</li>
                        <li>interfere with other users&apos; bidding activity</li>
                    </ul>
                    <p className="mt-2">
                        Mazad may cancel bids or restrict accounts if abuse or fraud is suspected.
                    </p>
                </section>

                <section>
                    <h2 className="mb-2 text-xl font-semibold">5. Platform Role</h2>
                    <p>
                        Mazad is a platform created as a school project to connect users in an
                        auction-style system.
                    </p>
                    <p className="mt-2">
                        Mazad is <strong>not responsible</strong> for the quality, safety, legality,
                        or accuracy of items posted by users, and is not responsible for disputes
                        between buyers and sellers.
                    </p>
                </section>

                <section>
                    <h2 className="mb-2 text-xl font-semibold">6. Prohibited Conduct</h2>
                    <p>Users may not:</p>
                    <ul className="mt-2 list-disc space-y-1 pl-6">
                        <li>use the platform for illegal purposes</li>
                        <li>post false or harmful content</li>
                        <li>attempt unauthorized access to the system</li>
                        <li>upload malicious code</li>
                        <li>harass or abuse other users</li>
                        <li>violate the rights of others</li>
                    </ul>
                </section>

                <section>
                    <h2 className="mb-2 text-xl font-semibold">7. Suspension and Removal</h2>
                    <p>
                        Mazad may remove listings, cancel bids, or suspend accounts if users violate
                        these Terms or create risk for the platform or other users.
                    </p>
                </section>

                <section>
                    <h2 className="mb-2 text-xl font-semibold">8. Disclaimer</h2>
                    <p>
                        Mazad is provided on an <strong>&ldquo;as is&rdquo;</strong> and <strong>&ldquo;as available&rdquo;</strong> basis.
                    </p>
                    <p className="mt-2">
                        Because this is a school project, we do not guarantee uninterrupted service,
                        error-free operation, or the completion of any communication between users.
                    </p>
                </section>

                <section>
                    <h2 className="mb-2 text-xl font-semibold">9. Limitation of Liability</h2>
                    <p>
                        To the maximum extent permitted by law, Mazad Team and the Mazad project team
                        are not liable for losses, damages, or disputes resulting from use of the
                        platform, listings, bids, or user conduct.
                    </p>
                </section>

                <section>
                    <h2 className="mb-2 text-xl font-semibold">10. Changes to the Terms</h2>
                    <p>
                        We may update these Terms from time to time. Updated Terms will be posted on
                        this page with a new effective date.
                    </p>
                </section>

                <section>
                    <h2 className="mb-2 text-xl font-semibold">11. Governing Law</h2>
                    <p>These Terms are governed by the laws of Morocco.</p>
                </section>

                <section>
                    <h2 className="mb-2 text-xl font-semibold">12. Contact</h2>
                    <p>
                        If you have questions about these Terms, contact:
                        <br />
                        <strong>Mazad Team</strong>
                        <br />
                        <strong>Email:</strong> mazad@team.com
                    </p>
                </section>
            </div>
        </main>
    );
};

export default TermsOfService;