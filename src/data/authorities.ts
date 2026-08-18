import type { AsnafId } from '@/lib/types';

/**
 * A second lens on the same eight categories: how other reputable zakat
 * authorities draw the same lines. This is deliberately NOT wired into the
 * pipeline — the categories, criteria and evidence machinery a case is
 * actually checked against stay LaunchGood's own throughout this demo. What
 * changes here is the /policy reference page's display of posture and
 * rationale, so a reviewer can see where reasonable authorities genuinely
 * diverge before treating any one reading as the only possible one.
 *
 * The three chosen are deliberately different in kind, not three versions of
 * the same thing: an operational UK charity that distributes zakat itself
 * through individual casework (NZF), a classical single-school fatwa service
 * answering case-by-case (AskImam, Hanafi), and a North American scholarly
 * council that rules by committee resolution (AMJA). The disagreements below
 * track real, well-known fault lines in the fiqh of zakat distribution — the
 * Hanafi-associated view that muallafat al-qulub's active share lapsed with
 * the conditions of early Islam, and the live contemporary debate over how
 * far "fi sabilillah" extends beyond its classical military sense — rather
 * than being invented for effect.
 *
 * Content is nonetheless an illustrative synthesis written for this demo: it
 * characterises each body's generally known public methodology, not a
 * verbatim reproduction of, or a substitute for, any institution's current
 * published rulings. A real deployment adopting a second authority's reading
 * would need that authority's own material reviewed directly, not this table.
 */

export type Posture = 'verified' | 'conditional' | 'not_verified';

export interface AuthorityPosture {
  posture: Posture;
  note: string;
}

export interface Authority {
  id: string;
  name: string;
  short: string;
  kind: string;
  postures: Partial<Record<AsnafId, AuthorityPosture>>;
}

export const AUTHORITIES: Authority[] = [
  {
    id: 'nzf',
    name: 'National Zakat Foundation',
    short: 'NZF',
    kind: 'UK operational charity — distributes zakat itself, through individual casework',
    postures: {
      fuqara_masakin: {
        posture: 'verified',
        note: 'Direct individual and household means-testing is NZF’s core distribution channel — if anything, the category the organisation is built around.',
      },
      amilin: {
        posture: 'conditional',
        note: 'Applies to NZF’s own collection costs under the same one-eighth ceiling, not to a campaign organizer’s fundraising overhead.',
      },
      muallafat_qulub: {
        posture: 'conditional',
        note: 'Practically rare in UK casework — handled as named, individual new-Muslim support cases rather than a standing campaign category.',
      },
      riqab: {
        posture: 'not_verified',
        note: 'No operational channel for this in a modern UK casework model.',
      },
      gharimin: {
        posture: 'verified',
        note: 'Direct debt relief for individuals in genuine hardship is a well-established, significant part of NZF’s own casework — its clearest point of departure from LaunchGood’s posture.',
      },
      fi_sabilillah: {
        posture: 'conditional',
        note: 'Interpreted narrowly and case by case rather than treated as a standing broad category.',
      },
      ibn_sabil: {
        posture: 'conditional',
        note: 'Rare but handled as an individual hardship case — someone stranded with no access to their own funds — rather than a standing category.',
      },
    },
  },
  {
    id: 'askimam',
    name: 'AskImam (Darul Iftaa)',
    short: 'AskImam',
    kind: 'Hanafi fatwa service — case-by-case rulings drawn from classical texts',
    postures: {
      fuqara_masakin: {
        posture: 'verified',
        note: 'The least contested category classically; a straightforward need test applies.',
      },
      amilin: {
        posture: 'conditional',
        note: 'Classical Hanafi fiqh ties this to a person formally appointed to collect zakat by a legitimate authority — narrower than “anyone administering funds.”',
      },
      muallafat_qulub: {
        posture: 'not_verified',
        note: 'A real, well-known Hanafi position holds this category’s active share lapsed with the specific early-caliphate conditions it originally addressed — the school AskImam’s rulings draw on is generally the most restrictive of the three here.',
      },
      riqab: {
        posture: 'conditional',
        note: 'Kept open in principle for modern captive-ransom analogues, but classical texts require very specific, individually verified circumstances — not a standing channel.',
      },
      gharimin: {
        posture: 'conditional',
        note: 'Requires verifying the debt was not incurred in disobedience or extravagance — a real classical condition, and the hardest part to evidence at a distance.',
      },
      fi_sabilillah: {
        posture: 'conditional',
        note: 'Classical Hanafi reading ties this closely to religious struggle in the classical sense, applied narrowly to modern analogues rather than general good causes.',
      },
      ibn_sabil: {
        posture: 'not_verified',
        note: 'Classically tied to a traveller literally cut off from their own wealth mid-journey; little practical analogue for a crowdfunding campaign.',
      },
    },
  },
  {
    id: 'amja',
    name: 'AMJA (Assembly of Muslim Jurists of America)',
    short: 'AMJA',
    kind: 'North American scholarly council — resolutions by committee, not single-mufti rulings',
    postures: {
      fuqara_masakin: {
        posture: 'verified',
        note: 'Uncontested across schools; council discussion tends to focus on defining a modern, nisab-relative sufficiency threshold rather than the category itself.',
      },
      amilin: {
        posture: 'conditional',
        note: 'Resolutions generally permit registered nonprofits acting as collection intermediaries, conditioned on the retained share being separately audited.',
      },
      muallafat_qulub: {
        posture: 'verified',
        note: 'Council resolutions tend to keep this category live and apply it to new-Muslim support broadly — closer to LaunchGood’s own reading than AskImam’s.',
      },
      riqab: {
        posture: 'not_verified',
        note: 'Generally treated as having no clear modern operational analogue in council resolutions.',
      },
      gharimin: {
        posture: 'conditional',
        note: 'Generally permitted with documented proof of the debt and its permissible purpose; seen in council discussion as under-used relative to demand.',
      },
      fi_sabilillah: {
        posture: 'verified',
        note: 'The widest single point of divergence across all three: many North American council resolutions extend this beyond LaunchGood’s own reading to Islamic education, da’wah and community infrastructure.',
      },
      ibn_sabil: {
        posture: 'conditional',
        note: 'Some resolutions extend this to modern displaced persons and refugees stranded without access to resources.',
      },
    },
  },
];
