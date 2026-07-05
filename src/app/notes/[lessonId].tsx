import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import CourseNoteCard from "../../components/CourseNoteCard";
import NoteEditor from "../../components/NoteEditor";
import { useAuth } from "../../context/AuthContext";

import {
  addNote,
  CourseNote,
  deleteNote,
  getLessonNotes,
  updateNote,
} from "../../services/notesService";

export default function LessonNotes() {
  const { lessonId } = useLocalSearchParams();
  const { user } = useAuth();

  const [notes, setNotes] = useState<CourseNote[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<CourseNote[]>([]);
  const [selectedNote, setSelectedNote] =
    useState<CourseNote | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!user || !lessonId) return;

    loadNotes();
  }, [user, lessonId]);

  useEffect(() => {
    filterNotes();
  }, [search, notes]);

  const loadNotes = async () => {
    if (!user) return;

    try {
      setLoading(true);

      const data = await getLessonNotes(
        user.uid,
        lessonId as string
      );

      setNotes(data);
      setFilteredNotes(data);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const filterNotes = () => {
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
  };

  const saveNote = async (
    title: string,
    content: string
  ) => {
    if (!user) return;

    try {
      setSaving(true);

      if (selectedNote?.id) {
        await updateNote(
          user.uid,
          selectedNote.id,
          title,
          content
        );

        Alert.alert(
          "Updated",
          "Note updated successfully."
        );
      } else {
        await addNote(
          user.uid,
          "",
          lessonId as string,
          title,
          content
        );

        Alert.alert(
          "Success",
          "Note saved successfully."
        );
      }

      setSelectedNote(null);

      await loadNotes();
    } catch (e) {
      console.log(e);

      Alert.alert(
        "Error",
        "Unable to save note."
      );
    } finally {
      setSaving(false);
    }
  };

  const removeNote = async (
    noteId: string
  ) => {
    if (!user) return;

    try {
      await deleteNote(user.uid, noteId);

      await loadNotes();
    } catch (e) {
      console.log(e);
    }
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator
          size="large"
          color="#2563EB"
        />

        <Text style={styles.loadingText}>
          Loading Notes...
        </Text>
      </View>
    );
  }
    return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <Text style={styles.heading}>
        📝 Lesson Notes
      </Text>

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
          <Text style={styles.emptyIcon}>
            📝
          </Text>

          <Text style={styles.emptyTitle}>
            No Notes Yet
          </Text>

          <Text style={styles.emptyText}>
            Take notes while learning.
          </Text>
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
    marginBottom: 20,
  },

  search: {
    backgroundColor: "#1F2937",
    color: "white",
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
    fontSize: 16,
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