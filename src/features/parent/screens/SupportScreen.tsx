import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, LayoutAnimation, UIManager, Platform } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AppHeader, Card, Icon, Screen } from '@components';
import { colors, spacing, typography, radii, IconName } from '@theme';
import type { ParentScreenProps } from '@/navigation/types';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const FAQS = [
  {
    question: 'How do I add a new child profile?',
    answer: 'Navigate to the Parent Home or All Children screen, and tap the "Add Child" button. Follow the wizard to complete the profile setup.',
  },
  {
    question: 'How does the assessment work?',
    answer: 'The assessment is a series of engaging, game-like activities that take around 15 minutes. It measures core reading and cognitive skills to build a personalized learning plan.',
  },
  {
    question: 'Can I delete my account?',
    answer: 'To completely delete your account and all associated data, please contact our support team using the email address below.',
  },
];

function AccordionItem({ question, answer }: { question: string; answer: string }) {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  return (
    <View style={styles.accordionContainer}>
      <TouchableOpacity 
        style={styles.accordionHeader} 
        onPress={toggleExpand}
        activeOpacity={0.7}
      >
        <Text style={styles.questionText}>{question}</Text>
        <View style={{ transform: [{ rotate: expanded ? '90deg' : '0deg' }] }}>
          <Icon name={IconName.chevronRight} size={24} color="textMuted" />
        </View>
      </TouchableOpacity>
      {expanded && (
        <View style={styles.accordionBody}>
          <Text style={styles.answerText}>{answer}</Text>
        </View>
      )}
    </View>
  );
}

export default function SupportScreen(): React.JSX.Element {
  const navigation = useNavigation<ParentScreenProps<'Support'>['navigation']>();
  const route = useRoute<ParentScreenProps<'Support'>['route']>();

  const handleBack = () => {
    // If we're deep linked or come from another flow, origin dictates the return route
    const origin = route.params?.origin;
    if (origin === 'ParentHome') {
      navigation.navigate('ParentHome');
    } else {
      // Fallback for Phase 4's ReadyToPlay or general goBack
      if (navigation.canGoBack()) {
        navigation.goBack();
      } else {
        navigation.navigate('ParentHome');
      }
    }
  };

  return (
    <Screen edges={{ top: true, bottom: true }} scroll>
      <AppHeader
        title="Support"
        action={{
          icon: IconName.arrowLeft,
          accessibilityLabel: 'Back',
          onPress: handleBack,
        }}
      />
      <View style={styles.content}>
        
        <Card style={styles.contactCard}>
          <View style={styles.contactHeader}>
            <Icon name={IconName.helpCircle} size={32} color="primary" />
            <Text style={styles.contactTitle}>Need more help?</Text>
          </View>
          <Text style={styles.contactBody}>
            If you have questions about the assessment or your child's report, our learning specialists are here for you.
          </Text>
          <TouchableOpacity style={styles.contactLink}>
            <Icon name={IconName.inbox} size={20} color="primary" />
            <Text style={styles.contactLinkText}>support@aksharedge.com</Text>
          </TouchableOpacity>
        </Card>

        <View style={styles.faqSection}>
          <Text style={styles.faqTitle}>Frequently Asked Questions</Text>
          <View style={styles.accordions}>
            {FAQS.map((faq, idx) => (
              <AccordionItem key={idx} question={faq.question} answer={faq.answer} />
            ))}
          </View>
        </View>

      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing.xl,
    gap: spacing.xxl,
  },
  contactCard: {
    padding: spacing.xl,
    gap: spacing.md,
  },
  contactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  contactTitle: {
    ...typography.title,
    color: colors.primaryDeep,
  },
  contactBody: {
    ...typography.body,
    color: colors.text,
  },
  contactLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  contactLinkText: {
    ...typography.button,
    color: colors.primary,
  },
  faqSection: {
    gap: spacing.lg,
  },
  faqTitle: {
    ...typography.title,
    color: colors.text,
  },
  accordions: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    overflow: 'hidden',
  },
  accordionContainer: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  accordionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
  },
  questionText: {
    ...typography.body,
    fontWeight: 'bold',
    color: colors.text,
    flex: 1,
    paddingRight: spacing.md,
  },
  accordionBody: {
    padding: spacing.lg,
    paddingTop: 0,
  },
  answerText: {
    ...typography.body,
    color: colors.textMuted,
  },
});
