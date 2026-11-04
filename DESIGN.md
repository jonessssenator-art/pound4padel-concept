# POUND4PADEL

Approved direction: full-width photographic first screen inspired by the user's first reference. Approved Islam photograph: assets/islam-refined.png. Do not regenerate his face or proportions. No other athlete images approved. Balls carry no branding. Racket and cream kit follow the supplied brandbook.

Palette: #101820 dark court surround; #1448a3 brand blue; #183269 secondary blue; #d4352c red; #dfd8c6 cream; #e0ec87 ball-derived accent. Typography: self-hosted Involve variable from brand source. Primary hero type sits either side of the central person. Mobile type is below his face, with a dark readability overlay. No fabricated reviews, prices or club metrics.

Sections: approved hero, macro balls, game format selector and interactive rally diagram, exact brand equipment imagery, architectural concept, practical FAQ, opening notice. Booking is explicitly unavailable until business details are supplied. Images of the athlete and balls are concept illustrations, disclosed in footer. Equipment and architecture are supplied brand material.

Motion: one staggered hero entrance, subtle scroll response in the ball scene, user-controlled explanatory rally; reduced-motion support. Equipment hover restricted to fine pointers. Functional tabs, menu, FAQ and anchor navigation.

Refinement after user review: product windows use fixed responsive frames and object-fit: contain, never crop the kit. Added blue kit and original front/profile racket view, product image dialog, detail hotspot, alternate architecture angle. Hero and ball imagery share a navy edge fade. Product still-life uses the same source racket and plain balls. Scroll response, controlled rally, product reveal and short view-change animations respect reduced motion. No other generated people used.

Racket correction: rejected generated equipment-scene.png. Main product scene now uses original racket-front.png from brandbook, showing front and profile without crop or distortion.

Game-format section: replaced the rejected flat court diagram with a single full-width photographic court scene. Integrated keyboard-accessible format tabs and distinct CTA button. Tab changes animate copy and restrained crop/zoom; reduced motion disables camera motion. Empty court is an edited version of the supplied court photograph. No added athlete imagery.

## Selected direction 1, November 2026
User selected the rendered direction-one proposal. Full-width approved Islam hero, dark #0c1922 surroundings, cream type and ball-derived lime actions. Follow hero with a 1.7:1 photographic community/tournament pair; photos open in the existing image dialog. Real supplied documentary photos also replace the speculative architecture in the club section. Dark women's-Friday section retains its dedicated content and group image. Original equipment remains complete and uncropped with existing color/view controls. Existing motion and reduced-motion support retained. No new booking integration or opening-date claims; the supplied opening photos supersede the old upcoming-opening notice. Layout overrides are isolated in direction-one.css. Responsive browser checks at 1400 and 390 pixels.

## Mandatory user preference
No arrow icons or arrow glyphs in any website buttons, links, navigation or decoration. Use text controls without arrows. Do not add user-facing references to AI, generation, synthetic imagery or related production notes, including alt text and metadata. These preferences supersede earlier footer-disclosure guidance. Preserve accurate functionality notices such as unavailable booking.

## Selected typography
User chose option 3: self-hosted Oswald weight 500 for headings and Manrope for body, navigation and buttons. typography.css overrides the previous Involve typography. No arrow icons or production notes.

## Interactive components, November 2026
Removed solid lime rectangular CTAs. Use cream or outlined rounded controls with 160ms press feedback and reduced-motion support. Hero has a compact three-choice game dock, selecting and focusing the matching game tab. Game tabs use a segmented selected state. Club photo viewer includes four supplied club photos, caption, thumbnails, previous/next text controls, keyboard navigation and horizontal touch swipe. Equipment stays in the same viewer without gallery controls. No arrow glyphs or decorative counters. Implemented in interactions.css and app.js.


## Component finish, November 2026
Shared styles live in components.css and components.js. Preserve the current hero assets and copy when refining controls. Content width caps at 1344px; page gutters are 20px on mobile, 32px on tablet, and at least 32px on desktop. Use the 8/16/24/32/48/64/80px spacing scale. Primary and secondary actions share ui-button: 48px minimum height, 24px horizontal padding, 14px Manrope. Compact controls are 44px high. Media corners are 12px. Segmented controls use ui-segmented with one sliding indicator, matching keyboard-accessible tab semantics. Numerals use lining figures; investor selectors and PDF metadata use tabular figures.
Pointer feedback takes 160ms; state changes take 180-220ms with the existing ease-out curve. Native dialogs and FAQ disclosure retain keyboard and reduced-motion behavior. Avoid repeated scroll entrances on reading content. Mobile gallery uses a stable 3:2 image frame without unnecessary vertical space. Keep section headlines and their supporting copy aligned to the corresponding content columns.


## Multi-page structure, November 2026
The home page introduces four destinations with compact visual previews. club.html contains documentary photos, the club gallery, game-format tabs and first-visit FAQ. women.html explains Friday play and visitor preparation. equipment.html retains the uncropped product gallery and colour/view controls. investors.html contains sourced architectural concepts, enlarged plan images, the area comparison and original PDF. All pages use the same header, footer, fonts, controls and spacing tokens; composition lives in pages.css. The current page is marked with aria-current. Home format choices use club.html?format=start|friends|practice#play. Old #play, #first and #availability links on the home page redirect to the club page. Do not invent prices, booking integration, equipment availability or investment terms.
