"use client";

import type { MultiServiceSettlementSnapshot } from "./multi-service-active-services-scene";
import { formatCkb, LayerCardHeader, cx } from "../shared";
import channelStyles from "./multi-service-channel.module.css";

export function FundingCard({ reveal }: { reveal: number }) {
  return (
    <div
      className={channelStyles.fundingWrap}
      style={{
        opacity: reveal,
        transform: `translateX(-50%) translateY(${18 * (1 - reveal)}px)`,
      }}
    >
      <div className={channelStyles.fundingCard}>
        <LayerCardHeader
          className={channelStyles.fundingHeader}
          iconClassName={channelStyles.fundingIcon}
          label="Initial funding (Layer 1)"
        />
        <div className={channelStyles.fundingBody}>
          <p className={channelStyles.fundingKicker}>Total locked amount</p>
          <p className={channelStyles.fundingAmount}>1,000 CKB</p>
        </div>
        <div className={channelStyles.distribution}>
          <div className={channelStyles.distributionBarWrap}>
            <div className={channelStyles.distributionBar} />
          </div>
          <div className={channelStyles.distributionLabels}>
            <span>1,000 CKB</span>
            <span>0 CKB</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function FinalSettlementCard({
  reveal,
  settlement,
}: {
  reveal: number;
  settlement?: MultiServiceSettlementSnapshot;
}) {
  const remaining = settlement?.remaining ?? 104;
  const used = settlement?.used ?? 896;
  const total = settlement?.total ?? 1000;
  const remainingPercent = Math.max(0, Math.min(100, (remaining / total) * 100));
  const usedPercent = 100 - remainingPercent;

  return (
    <div
      className={channelStyles.fundingWrap}
      style={{
        opacity: reveal,
        transform: `translateX(-50%) translateY(${18 * (1 - reveal)}px)`,
      }}
    >
      <div className={cx(channelStyles.fundingCard, channelStyles.settlementCard)}>
        <LayerCardHeader
          className={cx(channelStyles.fundingHeader, channelStyles.settlementHeader)}
          iconClassName={channelStyles.fundingIcon}
          label="Final settlement (Layer 1)"
        />
        <div className={channelStyles.fundingBody}>
          <p className={channelStyles.fundingKicker}>Final distributed balance</p>
        </div>
        <div className={channelStyles.distribution}>
          <div className={channelStyles.distributionBarWrap}>
            <div className={channelStyles.settlementDistributionBar}>
              <span className={channelStyles.settlementReturnedBar} style={{ width: `${remainingPercent}%` }} />
              <span className={channelStyles.settlementPaidBar} style={{ width: `${usedPercent}%` }} />
            </div>
          </div>
          <div className={cx(channelStyles.distributionLabels, channelStyles.settlementLabels)}>
            <span>
              <strong>{formatCkb(remaining)} CKB</strong>
              <small>Returned to Pico</small>
            </span>
            <span>
              <strong>{formatCkb(used)} CKB</strong>
              <small>Paid to Fiber Pass</small>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
