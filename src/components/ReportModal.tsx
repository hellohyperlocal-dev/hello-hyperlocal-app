import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Pressable } from 'react-native';
import { Flag, UserX, CheckCircle2 } from 'lucide-react-native';
import { fonts } from '../constants/fonts';
import { colors, radius } from '../constants/theme';

const REPORT_REASONS = ['Spam', 'Inappropriate content', 'Harassment', 'Something else'];

interface ReportModalProps {
  visible: boolean;
  onClose: () => void;
  authorName: string;
  onBlockConfirmed?: (authorName: string) => void;
}

type Step = 'menu' | 'reportReason' | 'reportDone' | 'blockDone';

export function ReportModal({ visible, onClose, authorName, onBlockConfirmed }: ReportModalProps) {
  const [step, setStep] = useState<Step>('menu');

  function handleClose() {
    onClose();
    setTimeout(() => setStep('menu'), 250);
  }

  function handleBlock() {
    onBlockConfirmed?.(authorName);
    setStep('blockDone');
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
      <Pressable style={styles.backdrop} onPress={handleClose} accessibilityLabel="Close" accessibilityRole="button">
        <Pressable
          style={styles.sheet}
          onPress={(e) => e.stopPropagation()}
          accessibilityViewIsModal
          accessibilityRole="none"
        >
          <View style={styles.handle} />

          {step === 'menu' && (
            <>
              <Text style={styles.title}>What's going on?</Text>
              <Text style={styles.subtitle}>Reports go straight to the community moderation team.</Text>

              <TouchableOpacity
                style={styles.optionRow}
                onPress={() => setStep('reportReason')}
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityLabel="Report post, flag this for the community team to review"
              >
                <View style={styles.optionIcon}>
                  <Flag size={18} color={colors.darkSpruce} />
                </View>
                <View style={styles.optionTextGroup}>
                  <Text style={styles.optionTitle}>Report post</Text>
                  <Text style={styles.optionSubtitle}>Flag this for the community team to review</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.optionRow}
                onPress={handleBlock}
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityLabel={`Block ${authorName}, you won't see posts from them again`}
              >
                <View style={styles.optionIcon}>
                  <UserX size={18} color={colors.darkSpruce} />
                </View>
                <View style={styles.optionTextGroup}>
                  <Text style={styles.optionTitle}>Block {authorName}</Text>
                  <Text style={styles.optionSubtitle}>You won't see posts from them again</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={handleClose}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityLabel="Cancel"
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            </>
          )}

          {step === 'reportReason' && (
            <>
              <Text style={styles.title}>Why are you reporting this?</Text>
              <View style={styles.reasonList}>
                {REPORT_REASONS.map((reason) => (
                  <TouchableOpacity
                    key={reason}
                    style={styles.reasonChip}
                    onPress={() => setStep('reportDone')}
                    activeOpacity={0.7}
                    accessibilityRole="button"
                    accessibilityLabel={reason}
                  >
                    <Text style={styles.reasonText}>{reason}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={handleClose}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityLabel="Cancel"
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            </>
          )}

          {(step === 'reportDone' || step === 'blockDone') && (
            <View style={styles.doneWrap} accessibilityLiveRegion="polite">
              <CheckCircle2 size={32} color={colors.radioactiveGrass} />
              <Text style={styles.doneTitle}>
                {step === 'reportDone' ? 'Thanks — report submitted' : `${authorName} blocked`}
              </Text>
              <Text style={styles.doneSubtitle}>
                {step === 'reportDone'
                  ? "We'll take a look and get back to you if we need more info."
                  : "You won't see their posts on your feed anymore."}
              </Text>
              <TouchableOpacity
                style={styles.doneBtn}
                onPress={handleClose}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityLabel="Done"
              >
                <Text style={styles.doneBtnText}>Done</Text>
              </TouchableOpacity>
            </View>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 15, 15, 0.4)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.warmWhite,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    padding: 24,
    paddingBottom: 36,
    gap: 4,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: radius.pill,
    backgroundColor: colors.border,
    alignSelf: 'center',
    marginBottom: 16,
  },
  title: {
    color: colors.onyx,
    fontFamily: fonts.sans.extraBold,
    fontSize: 18,
  },
  subtitle: {
    color: colors.muted,
    fontFamily: fonts.sans.regular,
    fontSize: 12,
    marginBottom: 12,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
  },
  optionIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.sm,
    backgroundColor: colors.softGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionTextGroup: {
    flex: 1,
    gap: 2,
  },
  optionTitle: {
    color: colors.onyx,
    fontFamily: fonts.sans.bold,
    fontSize: 14,
  },
  optionSubtitle: {
    color: colors.muted,
    fontFamily: fonts.sans.regular,
    fontSize: 11,
  },
  reasonList: {
    gap: 8,
    marginTop: 12,
    marginBottom: 8,
  },
  reasonChip: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderRadius: radius.sm,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  reasonText: {
    color: colors.onyx,
    fontFamily: fonts.sans.medium,
    fontSize: 13,
  },
  cancelBtn: {
    alignItems: 'center',
    paddingVertical: 14,
    marginTop: 8,
  },
  cancelText: {
    color: colors.muted,
    fontFamily: fonts.sans.bold,
    fontSize: 13,
  },
  doneWrap: {
    alignItems: 'center',
    paddingVertical: 12,
    gap: 6,
  },
  doneTitle: {
    color: colors.onyx,
    fontFamily: fonts.sans.extraBold,
    fontSize: 16,
    textAlign: 'center',
    marginTop: 4,
  },
  doneSubtitle: {
    color: colors.muted,
    fontFamily: fonts.sans.regular,
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 12,
  },
  doneBtn: {
    backgroundColor: colors.darkSpruce,
    borderRadius: radius.pill,
    paddingVertical: 12,
    paddingHorizontal: 32,
  },
  doneBtnText: {
    color: colors.white,
    fontFamily: fonts.sans.extraBold,
    fontSize: 13,
  },
});
