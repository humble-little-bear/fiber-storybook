"use client";

import { useSound } from "@/components/providers/sound-provider";
import type { SceneConfig } from "@/lib/story-content";
import {
  MULTI_SERVICE_TOTAL_CKB,
  multiServiceServices,
  type MultiServiceKey,
} from "@/lib/story-content";
import { beatProgress, CueWatcher, cx, easeInOutSine, progressAtBeat, SceneShell } from "../shared";
import { formatCkb } from "../shared";
import type { MultiServiceSettlementSnapshot } from "./multi-service-active-services-scene";
import { FinalSettlementCard, FundingCard } from "./multi-service-channel-cards";
import { BareAvatar, NodeStatus, ServiceNode } from "./multi-service-channel-nodes";
import channelStyles from "./multi-service-channel.module.css";
import storyStyles from "./multi-service-story.module.css";

const MULTI_SERVICE_CHANNEL_SCENE_BEATS = 3;
const MULTI_SERVICE_SETTLEMENT_SCENE_BEATS = 4;

type PaymentRouteVariant = "luggage" | "power-bank" | "massage";
type ChannelBoardVariant = "opening" | "payment-route" | "power-bank-route" | "massage-route" | "settlement" | "active-services";
type ActiveServicesState = {
  remaining: number;
  used: number;
  total: number;
  serviceSeconds: Record<MultiServiceKey, number>;
  onEndAllServices: () => void;
};
const serviceAccepts: Record<MultiServiceKey, string> = {
  luggage: "Accept: CKB",
  power: "Accept: SUDT",
  massage: "Accept: USD",
};

export function MultiServicePaymentRouteScene({
  scene,
  activeSceneId,
  onActiveChange,
  routeVariant = "luggage",
}: {
  scene: SceneConfig;
  activeSceneId: string;
  onActiveChange: (id: string) => void;
  routeVariant?: PaymentRouteVariant;
}) {
  return (
    <SceneShell
      scene={scene}
      activeSceneId={activeSceneId}
      onActiveChange={onActiveChange}
      stageStyle={() => ({ background: "var(--color-bg-yellow)" })}
    >
      {(progress) => (
        <div className={storyStyles.technicalTransitionStage}>
          <div className={storyStyles.technicalBaseLayer}>
            <MultiServiceChannelBoard
              progress={progress}
              variant={
                routeVariant === "massage"
                  ? "massage-route"
                  : routeVariant === "power-bank"
                    ? "power-bank-route"
                    : "payment-route"
              }
              caption={scene.copy.body}
            />
          </div>
        </div>
      )}
    </SceneShell>
  );
}

export function MultiServiceChannelScene({
  scene,
  activeSceneId,
  onActiveChange,
}: {
  scene: SceneConfig;
  activeSceneId: string;
  onActiveChange: (id: string) => void;
}) {
  return (
    <SceneShell
      scene={scene}
      activeSceneId={activeSceneId}
      onActiveChange={onActiveChange}
      stageStyle={() => ({ background: "var(--color-bg-yellow)" })}
    >
      {(progress) => (
        <div className={channelStyles.scene}>
          <CueWatcher
            progress={progress}
            cue="system.channel-active"
            threshold={progressAtBeat(2, MULTI_SERVICE_CHANNEL_SCENE_BEATS)}
            resetThreshold={progressAtBeat(1.5, MULTI_SERVICE_CHANNEL_SCENE_BEATS)}
          />
          <MultiServiceChannelBoard progress={progress} />
        </div>
      )}
    </SceneShell>
  );
}

export function MultiServiceSettlementScene({
  scene,
  activeSceneId,
  onActiveChange,
  settlement,
}: {
  scene: SceneConfig;
  activeSceneId: string;
  onActiveChange: (id: string) => void;
  settlement: MultiServiceSettlementSnapshot;
}) {
  return (
    <SceneShell
      scene={scene}
      activeSceneId={activeSceneId}
      onActiveChange={onActiveChange}
      stageStyle={() => ({ background: "var(--color-bg-yellow)" })}
    >
      {(progress) => (
        <div className={channelStyles.scene}>
          <MultiServiceChannelBoard progress={progress} variant="settlement" settlement={settlement} />
        </div>
      )}
    </SceneShell>
  );
}

export function MultiServiceChannelBoard({
  progress,
  variant = "opening",
  caption,
  settlement,
  activeServices,
}: {
  progress: number;
  variant?: ChannelBoardVariant;
  caption?: string;
  settlement?: MultiServiceSettlementSnapshot;
  activeServices?: ActiveServicesState;
}) {
  const { playCue } = useSound();
  const isRouteScene = variant !== "opening";
  const isSettlementScene = variant === "settlement";
  const isActiveServicesScene = variant === "active-services";
  const isPaymentRouteScene = isRouteScene && !isSettlementScene && !isActiveServicesScene;
  const isPowerBankRoute = variant === "power-bank-route";
  const isMassageRoute = variant === "massage-route";
  const useStaticPlainConnectors = !isRouteScene;
  const activeServiceKey: MultiServiceKey | null = isPaymentRouteScene
    ? isMassageRoute
      ? "massage"
      : isPowerBankRoute
        ? "power"
        : "luggage"
    : null;
  const totalBeats = isSettlementScene ? MULTI_SERVICE_SETTLEMENT_SCENE_BEATS : MULTI_SERVICE_CHANNEL_SCENE_BEATS;
  const fillProgress = easeInOutSine(beatProgress(progress, 0, 1, totalBeats));
  const activeReveal = easeInOutSine(beatProgress(progress, 1, 1, totalBeats));
  const fundingReveal = easeInOutSine(beatProgress(progress, 2, 1, totalBeats));
  const settlementReveal = easeInOutSine(beatProgress(progress, 2, 1, totalBeats));
  const activeShown = isRouteScene || activeReveal > 0.5;
  const closedShown = isSettlementScene && activeReveal > 0.5;
  const channelFill = isSettlementScene ? 65 * (1 - fillProgress) : isRouteScene ? 100 : 65 + fillProgress * 35;
  const statusLabel = isSettlementScene ? (closedShown ? "Closed" : "Closing") : activeShown ? "Active" : "Opening...";
  const statusColor = isSettlementScene
    ? closedShown
      ? "var(--color-status-closed)"
      : "var(--color-status-closing)"
    : activeShown
      ? "var(--color-status-active)"
      : "var(--color-status-opening)";

  return (
    <div
      className={cx(
        channelStyles.surface,
        isActiveServicesScene ? channelStyles.activeServicesSurface : channelStyles.surfaceWithTitle,
        isPaymentRouteScene && caption ? channelStyles.routeCaptionSurface : undefined,
      )}
    >
      {isActiveServicesScene ? null : <h2 className={channelStyles.title}>Fiber Behind the Scene</h2>}

      <div className={channelStyles.paymentGroup}>
        <div className={channelStyles.paymentRow}>
          <div className={channelStyles.paymentNodeStack}>
            <NodeStatus />
            <BareAvatar imageSrc="/shared/pico-avatar.png" imageAlt="Pico avatar" />
            <p className={channelStyles.name}>Pico</p>
          </div>

          <div className={channelStyles.channelStack}>
            {isSettlementScene ? (
              <FinalSettlementCard reveal={settlementReveal} settlement={settlement} />
            ) : isActiveServicesScene && activeServices ? (
              <ActiveServicesBalanceCard activeServices={activeServices} />
            ) : isRouteScene ? null : (
              <FundingCard reveal={fundingReveal} />
            )}

            <div className={channelStyles.channelWrap}>
              <div
                className={channelStyles.picoConnector}
                aria-hidden="true"
                style={{ opacity: isSettlementScene && closedShown ? 0 : 1 }}
              />
              <div className={channelStyles.channel}>
                <div
                  className={cx(channelStyles.channelFill, isSettlementScene ? channelStyles.channelFillClosing : undefined)}
                  style={{ width: `${channelFill}%` }}
                />
                <span className={channelStyles.channelLabel}>Payment Channel (Layer 2)</span>
              </div>
            </div>

            <div className={channelStyles.channelStatus}>
              <span>Status:</span>
              <span className={channelStyles.statusDetail}>
                <span
                  className={channelStyles.statusDot}
                  style={{ background: statusColor }}
                />
                {statusLabel}
              </span>
            </div>
          </div>

          <div className={cx(channelStyles.paymentNodeStack, channelStyles.fiberPassStack)}>
            <NodeStatus />
            <BareAvatar imageSrc="/chapter2/fiber-pass-avatar.png" imageAlt="Fiber Airport Pass avatar" />
            <p className={channelStyles.passName}>Fiber Airport Pass</p>
          </div>
        </div>
      </div>

      <div className={cx(channelStyles.services, isSettlementScene ? channelStyles.servicesSettled : undefined)}>
        {isRouteScene && !isSettlementScene ? (
          <div
            className={cx(
              channelStyles.serviceConnector,
              channelStyles.routeConnectorTop,
              activeServiceKey && activeServiceKey !== "luggage" ? channelStyles.dimmed : undefined,
            )}
            aria-hidden="true"
          >
            <span className={channelStyles.routeVertical} />
            <span className={channelStyles.routeHorizontal} />
            <span className={channelStyles.paymentPill}>Paying 0.1 CKB / sec</span>
          </div>
        ) : (
          <div
            className={cx(
              channelStyles.serviceConnector,
              channelStyles.connectorTop,
              useStaticPlainConnectors ? channelStyles.staticConnector : undefined,
            )}
            aria-hidden="true"
          />
        )}

        {isPowerBankRoute || isMassageRoute || isActiveServicesScene ? (
          <div
            className={cx(
              channelStyles.serviceConnector,
              channelStyles.routeConnectorHorizontal,
              activeServiceKey && activeServiceKey !== "power" ? channelStyles.dimmed : undefined,
            )}
            aria-hidden="true"
          >
            <span className={channelStyles.routeHorizontal} />
            <span className={cx(channelStyles.paymentPill, channelStyles.paymentPillCentered)}>
              Paying 0.1 SUDT / sec
            </span>
          </div>
        ) : (
          <div
            className={cx(
              channelStyles.serviceConnector,
              channelStyles.connectorHorizontal,
              isPaymentRouteScene ? channelStyles.dimmed : undefined,
              (useStaticPlainConnectors || isPaymentRouteScene) ? channelStyles.staticConnector : undefined,
            )}
            aria-hidden="true"
          />
        )}

        {isMassageRoute || isActiveServicesScene ? (
          <div
            className={cx(
              channelStyles.serviceConnector,
              channelStyles.routeConnectorBottom,
              activeServiceKey && activeServiceKey !== "massage" ? channelStyles.dimmed : undefined,
            )}
            aria-hidden="true"
          >
            <span className={channelStyles.routeVertical} />
            <span className={channelStyles.routeHorizontalBottom} />
            <span className={cx(channelStyles.paymentPill, channelStyles.paymentPillBottom)}>Paying 0.1 USD</span>
          </div>
        ) : (
          <div
            className={cx(
              channelStyles.serviceConnector,
              channelStyles.connectorBottom,
              isPaymentRouteScene ? channelStyles.dimmed : undefined,
              (useStaticPlainConnectors || isPaymentRouteScene) ? channelStyles.staticConnector : undefined,
            )}
            aria-hidden="true"
          />
        )}

        {multiServiceServices.map((service) => {
          const isDimmed = activeServiceKey !== null && service.key !== activeServiceKey;

          return (
            <ServiceNode
              key={service.key}
              className={cx(
                service.key === "luggage"
                  ? channelStyles.serviceLuggage
                  : service.key === "power"
                    ? channelStyles.servicePower
                    : channelStyles.serviceMassage,
                isDimmed ? channelStyles.dimmed : undefined,
              )}
              imageSrc={service.imageSrc}
              imageAlt={service.imageAlt}
              name={service.name}
              accepts={isActiveServicesScene ? service.rate : serviceAccepts[service.key]}
              detail={
                isActiveServicesScene && activeServices
                  ? `Time: ${activeServices.serviceSeconds[service.key].toLocaleString("en-US")} sec`
                  : undefined
              }
            />
          );
        })}
      </div>
      {isActiveServicesScene && activeServices ? (
        <button
          type="button"
          className={channelStyles.endServicesButton}
          onMouseEnter={() => playCue("ui.pop")}
          onClick={() => {
            playCue("system.shutdown");
            activeServices.onEndAllServices();
          }}
        >
          End all services
        </button>
      ) : null}
      {caption ? <p className={channelStyles.sceneCaption}>{caption}</p> : null}
    </div>
  );
}

function ActiveServicesBalanceCard({ activeServices }: { activeServices: ActiveServicesState }) {
  const remainingPercent = (activeServices.remaining / activeServices.total) * 100;
  const usedPercent = 100 - remainingPercent;

  return (
    <div className={cx(channelStyles.fundingWrap, channelStyles.activeBalanceWrap)}>
      <p className={channelStyles.activeBalanceTitle}>Micropayments off-chain</p>
      <div className={channelStyles.activeBalanceBar}>
        <span className={channelStyles.activeBalanceRemaining} style={{ width: `${remainingPercent}%` }} />
        <span className={channelStyles.activeBalanceUsed} style={{ width: `${usedPercent}%` }} />
        <p className={channelStyles.activeBalanceTotal}>Total: {formatCkb(activeServices.total || MULTI_SERVICE_TOTAL_CKB)} CKB</p>
      </div>
      <div className={channelStyles.activeBalanceLabels}>
        <span>{formatCkb(activeServices.remaining)} CKB</span>
        <span>{formatCkb(activeServices.used)} CKB</span>
      </div>
    </div>
  );
}
