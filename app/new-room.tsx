import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useState } from "react";
import { useRouter, Stack } from "expo-router";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { COLORS } from "@/constants/theme";

export default function NewRoomScreen() {
  const router = useRouter();
  const createRoom = useMutation(api.rooms.createRoom);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleCreate = async () => {
    if (!title.trim()) {
      Alert.alert("Помилка", "Будь ласка, введіть назву кімнати.");
      return;
    }

    setIsLoading(true);
    try {
      const roomId = await createRoom({
        title: title.trim(),
        description: description.trim() || undefined,
      });
      router.back();
      router.push(`/chat/${roomId}`);
    } catch (error) {
      console.error("Error creating room", error);
      Alert.alert("Помилка", "Не вдалося створити кімнату.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-surface">
      <Stack.Screen options={{ title: "Нова кімната", headerRight: () => null }} />

      <ScrollView 
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="w-full max-w-2xl mx-auto p-6 gap-4 mt-2">
          <View>
            <Text className="text-textMuted text-xs font-semibold uppercase mb-2">
              Назва кімнати *
            </Text>
            <TextInput
              className="bg-secondary border border-surfaceLight rounded-2xl px-4 py-3.5 text-white text-base"
              placeholder="Наприклад: Обговорення React Native"
              placeholderTextColor={COLORS.textMuted}
              value={title}
              onChangeText={setTitle}
              maxLength={100}
              autoFocus
            />
          </View>

          <View>
            <Text className="text-textMuted text-xs font-semibold uppercase mb-2">
              Опис (необов'язково)
            </Text>
            <TextInput
              className="bg-secondary border border-surfaceLight rounded-2xl px-4 py-3.5 text-white text-base min-h-[100px]"
              placeholder="Короткий опис теми спілкування..."
              placeholderTextColor={COLORS.textMuted}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              maxLength={300}
              textAlignVertical="top"
            />
          </View>

          <TouchableOpacity
            onPress={handleCreate}
            disabled={isLoading || !title.trim()}
            className={`mt-4 py-4 rounded-2xl items-center justify-center bg-primary w-full ${
              isLoading || !title.trim() ? "opacity-50" : "active:opacity-80"
            }`}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text className="text-white text-base font-bold">Створити кімнату</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}