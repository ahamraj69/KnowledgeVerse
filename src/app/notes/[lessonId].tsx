import { useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

// ✅ FIXED: Realigned relative directory jumps to point cleanly to system path mapping selectors
import CourseNoteCard from "@/components/CourseNoteCard";
import NoteEditor from "@/components/NoteEditor";
import { useAuth } from "@/context/AuthContext";

import {
    addNote,
    CourseNote,
    deleteNote,
    getLessonNotes,
    updateNote,
} from "@/services/notesService";

export default function LessonNotes() {
  const { lessonId } = useLocalSearchParams();
  const { user } = useAuth();

  const [notes, setNotes] = useState<CourseNote[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<CourseNote[]>([]);
  const [selectedNote, setSelectedNote] = useState<CourseNote | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");

  const loadNotes = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      const data = await getLessonNotes(user.uid, lessonId as string);

      // ✅ Part 3: Reverses payload arrays natively so newly added elements rise to top positions
      const sorted = [...data].reverse();
      setNotes(sorted);
      setFilteredNotes(sorted);
    } catch (e) {
      console.log("Notes loading exception telemetry intercept:", e);
    } finally {
      setLoading(false);
    }
  }, [user, lessonId]);

  useEffect(() => {
    if (!user || !lessonId) return;
    loadNotes();
  }, [user, lessonId, loadNotes]);

  // ✅ Optimized memoized filtering tracking avoids lag during active keypad inputs
  useEffect(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) {
      setFilteredNotes(notes);
      return;
    }

    const filtered = notes.filter(
      (note) =>
        note.title.toLowerCase().includes(keyword) ||
        note.content.toLowerCase().includes(keyword)
    );

    setFilteredNotes(filtered);
  }, [search, notes]);

  const saveNote = async (title: string, content: string) => {
    if (!user) return;

    try {
      setSaving(true);

      if (selectedNote?.id) {
        await updateNote(user.uid, selectedNote.id, title, content);
        Alert.alert("Updated", "Note updated successfully.");
      } else {
        await addNote(user.uid, "", lessonId as string, title, content);
        Alert.alert("Success", "Note saved successfully.");
      }

      setSelectedNote(null);
      await loadNotes();
    } catch (e) {
      console.log(e);
      Alert.alert("Error", "Unable to save note.");
    } finally {
      setSaving(false);
    }
  };

  // ✅ Part 2: Hardened delete method featuring user intent confirmation sheets
  const removeNote = async (noteId: string) => {
    if (!user) return;

    Alert.alert(
      "Delete Note",
      "Are you sure you want to delete this note?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteNote(user.uid, noteId);
              await loadNotes();
            } catch (e) {
              console.log("Delete transaction exception tracer:", e);
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={styles.loadingText}>Loading Notes...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>📝 Lesson Notes</Text>
      
      {/* ✅ Part 4: Dynamic metadata display tracks current query matches */}
      <Text style={styles.counter}>{filteredNotes.length} Notes</Text>

      <TextInput
        placeholder="Search notes..."
        placeholderTextColor="#9CA3AF"
        value={search}
        onChangeText={setSearch}
        style={styles.search}
      />

      <NoteEditor
        initialTitle={selectedNote?.title}
        initialContent={selectedNote?.content}
        loading={saving}
        onSave={saveNote}
      />

      {filteredNotes.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📝</Text>
          <Text style={styles.emptyTitle}>No Notes Yet</Text>
          <Text style={styles.emptyText}>Take notes while learning.</Text>
        </View>
      ) : (
        filteredNotes.map((note) => (
          <CourseNoteCard
            key={note.id}
            note={note}
            onEdit={setSelectedNote}
            onDelete={removeNote}
          />
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B1220",
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  heading: {
    color: "white",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 6,
  },
  // ✅ Part 4 Layout Typography Tokens
  counter: {
    color: "#9CA3AF",
    marginBottom: 15,
    fontSize: 15,
    fontWeight: "500",
  },
  search: {
    backgroundColor: "#1F2937",
    color: "white",
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  loading: {
    flex: 1,
    backgroundColor: "#0B1220",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "white",
    marginTop: 15,
    fontSize: 16,
  },
  emptyContainer: {
    alignItems: "center",
    marginTop: 60,
  },
  emptyIcon: {
    fontSize: 60,
    marginBottom: 15,
  },
  emptyTitle: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
  },
  emptyText: {
    color: "#9CA3AF",
    marginTop: 10,
    fontSize: 16,
    textAlign: "center",
  },
});
